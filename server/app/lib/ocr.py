import base64
import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
from app.lib.schemas import AnalyseRequest

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

SUPPORTED_FORMATS = {"image/jpeg", "image/png", "image/webp"}
MAX_IMAGE_SIZE_MB = 10


class OCRError(Exception):
    def __init__(self, code: str, message: str):
        self.code = code
        self.message = message
        super().__init__(message)


def validate_image(content_type: str, size_bytes: int) -> None:
    if content_type not in SUPPORTED_FORMATS:
        raise OCRError(
            code="INVALID_FORMAT",
            message=f"Unsupported image format {content_type}. Use JPEG, PNG, or WebP.",
        )
    if size_bytes > MAX_IMAGE_SIZE_MB * 1024 * 1024:
        raise OCRError(
            code="FILE_TOO_LARGE",
            message=f"Image must be under {MAX_IMAGE_SIZE_MB}MB.",
        )


async def extract_ingredients_from_image(
    image_bytes: bytes,
    content_type: str,
    region: str,
) -> AnalyseRequest:

    validate_image(content_type, len(image_bytes))

    image_b64 = base64.standard_b64encode(image_bytes).decode("utf-8")

    extraction_prompt = """You are scanning a product label or ingredients list from a photo.

Your task has two parts:

PART 1 — EXTRACT TEXT
Extract all visible text from this image. Focus on:
- Product name and brand
- Full ingredients list
- Any E-numbers or additive codes
- Any halal or certification logos/text visible

If the text is in a non-English language, extract it as-is and also provide
an English translation in brackets after each non-English section.

PART 2 — STRUCTURE THE DATA
From the extracted text, identify:
- product_name: the product name (string, empty string if not found)
- brand: the brand name (string, empty string if not found)  
- ingredients: the full ingredients text as a single string (empty string if not found)
- certifications: any halal certification text or logos visible (list of strings)
- confidence: how confident you are in the extraction 0 to 100 (number)
  - 90-100: clear sharp image, all text readable
  - 70-89: mostly clear, minor parts unreadable
  - 50-69: blurry or partially visible but main ingredients extractable
  - below 50: too blurry, too dark, or ingredients not visible

Respond with VALID JSON ONLY.
No markdown. No code fences. No explanation. No text before or after.
The response must begin with { and end with }.

{
  "product_name": "string",
  "brand": "string",
  "ingredients": "string",
  "certifications": ["string"],
  "confidence": number,
  "extraction_notes": "string — any issues with the image quality or extraction"
}"""

    try:
        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                types.Part.from_bytes(
                    data=base64.standard_b64decode(image_b64),
                    mime_type=content_type,
                ),
                extraction_prompt,
            ],
            config=types.GenerateContentConfig(temperature=0.1),
        )
        raw_text = response.text

    except Exception as e:
        error_message = str(e).lower()
        if "429" in error_message or "quota" in error_message:
            raise OCRError(
                code="RATE_LIMITED",
                message="Rate limit hit. Wait a moment and try again.",
            )
        raise OCRError(
            code="API_ERROR",
            message=f"Gemini vision error: {str(e)}",
        )

    try:
        import json
        cleaned = raw_text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
        extracted = json.loads(cleaned)
    except json.JSONDecodeError:
        raise OCRError(
            code="INVALID_RESPONSE",
            message="Could not parse Gemini vision response.",
        )

    if extracted.get("confidence", 0) < 40:
        raise OCRError(
            code="LOW_CONFIDENCE",
            message=f"Image quality too low to extract ingredients reliably. {extracted.get('extraction_notes', 'Try a clearer photo.')}",
        )

    product_name = extracted.get("product_name") or "Unknown Product"
    brand = extracted.get("brand") or ""
    ingredients = extracted.get("ingredients") or ""
    certifications = extracted.get("certifications") or []

    if certifications:
        cert_str = ", ".join(certifications)
        if ingredients:
            ingredients += f"\nCertifications visible on label: {cert_str}"
        else:
            ingredients = f"Certifications visible on label: {cert_str}"

    if not ingredients and not product_name:
        raise OCRError(
            code="NO_TEXT_FOUND",
            message="No ingredients or product name found in image. Try photographing the ingredients list directly.",
        )

    display_name = f"{product_name}{' by ' + brand if brand else ''}"

    return AnalyseRequest(
        product_name=display_name,
        ingredients=ingredients if ingredients else None,
        region=region,
    )
import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv
from app.lib.schemas import AnalyseRequest, AnalysisResult
from app.lib.prompts import build_prompt
from app.lib.halal_rules import get_region_rules
from app.lib.e_numbers import build_e_number_summary

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class AnalysisError(Exception):
    def __init__(self, code: str, message: str):
        self.code = code
        self.message = message
        super().__init__(message)


def clean_response(text: str) -> str:
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()


async def analyse_product(request: AnalyseRequest) -> AnalysisResult:
    try:
        rules = get_region_rules(request.region)

        e_number_summary = build_e_number_summary(
            request.ingredients or "", request.region
        )

        prompt = build_prompt(
            product_name=request.product_name,
            ingredients=request.ingredients,
            region=request.region,
            rules=rules,
            e_number_summary=e_number_summary,
        )

        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.1,
            ),
        )

        raw_text = response.text

    except Exception as e:
        error_message = str(e).lower()
        if "429" in error_message or "quota" in error_message or "rate" in error_message:
            raise AnalysisError(
                code="RATE_LIMITED",
                message="Gemini rate limit hit. Wait a moment and try again.",
            )
        raise AnalysisError(
            code="API_ERROR",
            message=f"Gemini API error: {str(e)}",
        )

    try:
        cleaned = clean_response(raw_text)
        parsed = json.loads(cleaned)
    except json.JSONDecodeError:
        raise AnalysisError(
            code="INVALID_RESPONSE",
            message="Gemini returned non-JSON. Try again.",
        )

    try:
        result = AnalysisResult(**parsed)
    except Exception as e:
        raise AnalysisError(
            code="INVALID_RESPONSE",
            message=f"Response did not match expected schema: {str(e)}",
        )

    return result
import httpx
from app.lib.schemas import AnalyseRequest


OFF_URL = "https://world.openfoodfacts.org/api/v2/product/{barcode}.json"
OFF_FIELDS = "product_name,brands,ingredients_text,additives_tags,categories_tags,image_url"


class BarcodeError(Exception):
    def __init__(self, code: str, message: str):
        self.code = code
        self.message = message
        super().__init__(message)


async def lookup_barcode(barcode: str, region: str) -> AnalyseRequest:
    url = OFF_URL.format(barcode=barcode)

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                url,
                params={"fields": OFF_FIELDS},
                headers={"User-Agent": "BarakahHalalScanner/1.0"},
            )
    except httpx.TimeoutException:
        raise BarcodeError(
            code="TIMEOUT",
            message="Open Food Facts request timed out. Try again.",
        )
    except httpx.RequestError as e:
        raise BarcodeError(
            code="NETWORK_ERROR",
            message=f"Network error reaching Open Food Facts: {str(e)}",
        )

    if response.status_code != 200:
        raise BarcodeError(
            code="API_ERROR",
            message=f"Open Food Facts returned status {response.status_code}",
        )

    data = response.json()

    if data.get("status") == 0 or "product" not in data:
        raise BarcodeError(
            code="NOT_FOUND",
            message="Product not found in Open Food Facts database.",
        )

    product = data["product"]

    product_name = (
        product.get("product_name")
        or product.get("product_name_en")
        or "Unknown Product"
    ).strip()

    brand = (product.get("brands") or "").split(",")[0].strip()

    if product_name == "Unknown Product" and brand:
        product_name = brand

    ingredients = (product.get("ingredients_text") or "").strip()

    additives = product.get("additives_tags", [])
    if additives:
        e_codes = [
            tag.replace("en:", "").upper()
            for tag in additives
            if tag.startswith("en:e")
        ]
        if e_codes:
            e_codes_str = ", ".join(e_codes)
            if ingredients:
                ingredients += f"\nDetected additives: {e_codes_str}"
            else:
                ingredients = f"Detected additives: {e_codes_str}"

    return AnalyseRequest(
        product_name=f"{product_name}{' by ' + brand if brand else ''}",
        ingredients=ingredients if ingredients else None,
        region=region,
    )
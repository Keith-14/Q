import os
import hashlib
from supabase import create_client, Client
from dotenv import load_dotenv
from app.lib.schemas import AnalysisResult, Alternative

load_dotenv()

supabase: Client = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_KEY", ""),
)


class DatabaseError(Exception):
    def __init__(self, code: str, message: str):
        self.code = code
        self.message = message
        super().__init__(message)


def hash_ingredients(ingredients: str) -> str:
    return hashlib.sha256(ingredients.strip().lower().encode()).hexdigest()[:16]


async def get_alternatives_from_db(
    category: str,
    region: str,
    limit: int = 3,
) -> list[Alternative]:
    try:
        category_response = (
            supabase.table("categories")
            .select("id")
            .ilike("name", f"%{category}%")
            .limit(1)
            .execute()
        )

        if not category_response.data:
            return []

        category_id = category_response.data[0]["id"]

        products_response = (
            supabase.table("products")
            .select("name, emoji, note, certified_by, brands(name, certification_body)")
            .eq("category_id", category_id)
            .eq("status", "halal")
            .contains("regions", [region])
            .limit(limit)
            .execute()
        )

        if not products_response.data:
            products_response = (
                supabase.table("products")
                .select("name, emoji, note, certified_by, brands(name, certification_body)")
                .eq("category_id", category_id)
                .eq("status", "halal")
                .limit(limit)
                .execute()
            )

        alternatives = []
        for row in products_response.data:
            brand_data = row.get("brands") or {}
            alternatives.append(
                Alternative(
                    emoji=row.get("emoji") or "🛒",
                    name=row.get("name") or "",
                    brand=brand_data.get("name") or "",
                    note=row.get("note") or "",
                    certified_by=row.get("certified_by")
                    or brand_data.get("certification_body"),
                )
            )

        return alternatives

    except Exception as e:
        print(f"Database alternatives error: {e}")
        return []


async def store_scan(
    result: AnalysisResult,
    region: str,
    ingredients: str | None = None,
    session_id: str | None = None,
) -> None:
    try:
        record = {
            "product_name": result.product_name,
            "brand": result.brand,
            "status": result.status,
            "confidence": result.confidence,
            "verdict": result.verdict,
            "category": result.category,
            "region": region,
            "ingredients_hash": hash_ingredients(ingredients) if ingredients else None,
            "session_id": session_id,
        }

        supabase.table("scan_history").insert(record).execute()

    except Exception as e:
        print(f"Failed to store scan: {e}")


async def get_cached_scan(
    ingredients_hash: str,
    region: str,
) -> AnalysisResult | None:
    try:
        response = (
            supabase.table("scan_history")
            .select("*")
            .eq("ingredients_hash", ingredients_hash)
            .eq("region", region)
            .order("scanned_at", desc=True)
            .limit(1)
            .execute()
        )

        if not response.data:
            return None

        row = response.data[0]

        return AnalysisResult(
            product_name=row["product_name"],
            brand=row["brand"] or "",
            status=row["status"],
            confidence=row["confidence"] or 0,
            verdict=row["verdict"] or "",
            microcopy="",
            flagged_ingredients=[],
            safe_ingredients=[],
            enumbers=[],
            alternatives=[],
            category=row["category"] or "",
            region_ruling="",
            learn_more_topic="",
        )

    except Exception as e:
        print(f"Cache lookup error: {e}")
        return None
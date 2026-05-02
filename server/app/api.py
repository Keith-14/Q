from fastapi import APIRouter, UploadFile, File, Form, Query
from fastapi.responses import JSONResponse
from app.lib.schemas import AnalyseRequest, AnalysisResult, ErrorResponse
from app.lib.analyse import analyse_product, AnalysisError
from app.lib.barcode import lookup_barcode, BarcodeError
from app.lib.ocr import extract_ingredients_from_image, OCRError
from app.lib.database import (
    get_alternatives_from_db,
    store_scan,
    get_cached_scan,
    hash_ingredients,
)
from app.lib.stats import (
    get_weekly_stats,
    get_scan_history,
    get_all_time_stats,
    StatsError,
)
from pydantic import BaseModel

router = APIRouter()


async def enrich_with_db_alternatives(
    result: AnalysisResult,
    region: str,
) -> AnalysisResult:
    if result.status not in ("doubtful", "haram"):
        return result

    db_alternatives = await get_alternatives_from_db(
        category=result.category,
        region=region,
    )

    if db_alternatives:
        result.alternatives = db_alternatives

    return result


async def run_analysis(
    request: AnalyseRequest,
    region: str,
    session_id: str | None = None,
) -> AnalysisResult:
    ingredients_hash = (
        hash_ingredients(request.ingredients)
        if request.ingredients
        else None
    )

    if ingredients_hash:
        cached = await get_cached_scan(ingredients_hash, region)
        if cached:
            return cached

    result = await analyse_product(request)
    result = await enrich_with_db_alternatives(result, region)

    record_id = await store_scan(
        result=result,
        region=region,
        ingredients=request.ingredients,
        session_id=session_id,
    )

    return result


class BarcodeRequest(BaseModel):
    barcode: str
    region: str = "UK"
    session_id: str | None = None


class AnalyseRequestWithSession(AnalyseRequest):
    session_id: str | None = None


@router.post("/api/analyse", response_model=AnalysisResult)
async def analyse(request: AnalyseRequestWithSession):
    try:
        result = await run_analysis(request, request.region, request.session_id)
        return result

    except AnalysisError as e:
        if e.code == "RATE_LIMITED":
            return JSONResponse(status_code=429, content=ErrorResponse(error="Rate limit hit. Wait a moment and try again.").model_dump())
        if e.code == "INVALID_RESPONSE":
            return JSONResponse(status_code=422, content=ErrorResponse(error="Could not parse AI response. Try again.", details=e.message).model_dump())
        return JSONResponse(status_code=500, content=ErrorResponse(error="Analysis failed.", details=e.message).model_dump())

    except Exception as e:
        print(f"Unexpected error: {e}")
        return JSONResponse(status_code=500, content=ErrorResponse(error="Unexpected error. Please try again.").model_dump())


@router.post("/api/scan/barcode", response_model=AnalysisResult)
async def scan_barcode(request: BarcodeRequest):
    try:
        analyse_request = await lookup_barcode(request.barcode, request.region)
        result = await run_analysis(analyse_request, request.region, request.session_id)
        return result

    except BarcodeError as e:
        if e.code == "NOT_FOUND":
            return JSONResponse(status_code=404, content=ErrorResponse(error="Product not found. Try scanning the ingredients list instead.", details=e.message).model_dump())
        if e.code == "TIMEOUT":
            return JSONResponse(status_code=504, content=ErrorResponse(error="Product lookup timed out. Try again.", details=e.message).model_dump())
        return JSONResponse(status_code=500, content=ErrorResponse(error="Barcode lookup failed.", details=e.message).model_dump())

    except AnalysisError as e:
        if e.code == "RATE_LIMITED":
            return JSONResponse(status_code=429, content=ErrorResponse(error="Rate limit hit. Wait a moment and try again.").model_dump())
        return JSONResponse(status_code=500, content=ErrorResponse(error="Analysis failed.", details=e.message).model_dump())

    except Exception as e:
        print(f"Unexpected error: {e}")
        return JSONResponse(status_code=500, content=ErrorResponse(error="Unexpected error. Please try again.").model_dump())


@router.post("/api/scan/ocr", response_model=AnalysisResult)
async def scan_ocr(
    file: UploadFile = File(...),
    region: str = Form(default="UK"),
    session_id: str | None = Form(default=None),
):
    try:
        image_bytes = await file.read()
        content_type = file.content_type or "image/jpeg"

        from app.lib.ocr import resolve_content_type
        content_type = resolve_content_type(content_type, file.filename or "")

        analyse_request = await extract_ingredients_from_image(
            image_bytes=image_bytes,
            content_type=content_type,
            region=region,
        )

        result = await run_analysis(analyse_request, region, session_id)
        return result

    except OCRError as e:
        if e.code == "RATE_LIMITED":
            return JSONResponse(status_code=429, content=ErrorResponse(error="Rate limit hit. Wait a moment and try again.").model_dump())
        if e.code in ("INVALID_FORMAT", "FILE_TOO_LARGE"):
            return JSONResponse(status_code=400, content=ErrorResponse(error=e.message).model_dump())
        if e.code in ("LOW_CONFIDENCE", "NO_TEXT_FOUND"):
            return JSONResponse(status_code=422, content=ErrorResponse(error=e.message).model_dump())
        return JSONResponse(status_code=500, content=ErrorResponse(error="Image scan failed.", details=e.message).model_dump())

    except AnalysisError as e:
        if e.code == "RATE_LIMITED":
            return JSONResponse(status_code=429, content=ErrorResponse(error="Rate limit hit. Wait a moment and try again.").model_dump())
        return JSONResponse(status_code=500, content=ErrorResponse(error="Analysis failed.", details=e.message).model_dump())

    except Exception as e:
        print(f"Unexpected error: {e}")
        return JSONResponse(status_code=500, content=ErrorResponse(error="Unexpected error. Please try again.").model_dump())


@router.get("/api/stats/weekly")
async def weekly_stats(session_id: str = Query(...)):
    try:
        stats = await get_weekly_stats(session_id)
        return stats

    except StatsError as e:
        return JSONResponse(status_code=500, content=ErrorResponse(error=e.message).model_dump())

    except Exception as e:
        print(f"Unexpected error: {e}")
        return JSONResponse(status_code=500, content=ErrorResponse(error="Unexpected error.").model_dump())


@router.get("/api/stats/alltime")
async def all_time_stats(session_id: str = Query(...)):
    try:
        stats = await get_all_time_stats(session_id)
        return stats

    except StatsError as e:
        return JSONResponse(status_code=500, content=ErrorResponse(error=e.message).model_dump())

    except Exception as e:
        print(f"Unexpected error: {e}")
        return JSONResponse(status_code=500, content=ErrorResponse(error="Unexpected error.").model_dump())


@router.get("/api/stats/history")
async def scan_history(
    session_id: str = Query(...),
    limit: int = Query(default=20, le=100),
    offset: int = Query(default=0),
):
    try:
        history = await get_scan_history(session_id, limit, offset)
        return history

    except StatsError as e:
        return JSONResponse(status_code=500, content=ErrorResponse(error=e.message).model_dump())

    except Exception as e:
        print(f"Unexpected error: {e}")
        return JSONResponse(status_code=500, content=ErrorResponse(error="Unexpected error.").model_dump())
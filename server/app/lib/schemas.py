from pydantic import BaseModel, Field
from typing import Optional
from app.lib.halal_rules import HalalStatus, Region


class AnalyseRequest(BaseModel):
    product_name: str = Field(..., min_length=1, max_length=200)
    ingredients: Optional[str] = Field(None, max_length=2000)
    region: Region = Field(default="UK")


class IngredientFlag(BaseModel):
    name: str
    reason: str
    severity: str  # "red" or "yellow"


class ENumberResult(BaseModel):
    code: str
    name: str
    status: HalalStatus
    source: str


class Alternative(BaseModel):
    emoji: str
    name: str
    brand: str
    note: str
    certified_by: Optional[str] = None


class AnalysisResult(BaseModel):
    product_name: str
    brand: str
    status: HalalStatus
    confidence: int = Field(..., ge=0, le=100)
    verdict: str
    microcopy: str
    flagged_ingredients: list[IngredientFlag] = []
    safe_ingredients: list[str] = []
    enumbers: list[ENumberResult] = []
    alternatives: list[Alternative] = Field(default=[], max_length=3)
    category: str
    region_ruling: str
    learn_more_topic: str


class ErrorResponse(BaseModel):
    error: str
    details: Optional[str] = None
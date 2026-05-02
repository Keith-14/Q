from datetime import datetime, timedelta, timezone
from supabase import Client
from app.lib.database import supabase


class StatsError(Exception):
    def __init__(self, code: str, message: str):
        self.code = code
        self.message = message
        super().__init__(message)


async def get_weekly_stats(session_id: str) -> dict:
    try:
        now = datetime.now(timezone.utc)
        week_start = now - timedelta(days=7)

        response = (
            supabase.table("scan_history")
            .select("status, category, scanned_at")
            .eq("session_id", session_id)
            .gte("scanned_at", week_start.isoformat())
            .order("scanned_at", desc=True)
            .execute()
        )

        scans = response.data or []

        total = len(scans)
        halal_count = sum(1 for s in scans if s["status"] == "halal")
        doubtful_count = sum(1 for s in scans if s["status"] == "doubtful")
        haram_count = sum(1 for s in scans if s["status"] == "haram")

        halal_pct = round((halal_count / total) * 100) if total > 0 else 0

        category_counts: dict[str, int] = {}
        for scan in scans:
            cat = scan.get("category") or "Unknown"
            category_counts[cat] = category_counts.get(cat, 0) + 1

        top_category = (
            max(category_counts, key=lambda k: category_counts[k])
            if category_counts
            else None
        )

        avoided = doubtful_count + haram_count

        if total == 0:
            message = "No scans yet this week. Start scanning to track your halal choices."
        elif halal_pct == 100:
            message = f"Perfect week! All {total} of your scans were halal choices 🤍"
        elif halal_pct >= 80:
            message = f"You protected your deen {avoided} times this week 🤍"
        elif halal_pct >= 50:
            message = f"{halal_pct}% of your scans were halal — keep going 💪"
        else:
            message = f"You made {halal_count} halal choices this week. Every scan counts 🤍"

        return {
            "period": "last_7_days",
            "week_start": week_start.date().isoformat(),
            "week_end": now.date().isoformat(),
            "total_scans": total,
            "halal_count": halal_count,
            "doubtful_count": doubtful_count,
            "haram_count": haram_count,
            "halal_percentage": halal_pct,
            "avoided_count": avoided,
            "top_category": top_category,
            "category_breakdown": category_counts,
            "message": message,
        }

    except Exception as e:
        raise StatsError(
            code="STATS_ERROR",
            message=f"Failed to fetch weekly stats: {str(e)}",
        )


async def get_scan_history(
    session_id: str,
    limit: int = 20,
    offset: int = 0,
) -> dict:
    try:
        response = (
            supabase.table("scan_history")
            .select("*")
            .eq("session_id", session_id)
            .order("scanned_at", desc=True)
            .range(offset, offset + limit - 1)
            .execute()
        )

        count_response = (
            supabase.table("scan_history")
            .select("id", count="exact")
            .eq("session_id", session_id)
            .execute()
        )

        total_count = count_response.count or 0

        return {
            "scans": response.data or [],
            "total": total_count,
            "limit": limit,
            "offset": offset,
            "has_more": (offset + limit) < total_count,
        }

    except Exception as e:
        raise StatsError(
            code="STATS_ERROR",
            message=f"Failed to fetch scan history: {str(e)}",
        )


async def get_all_time_stats(session_id: str) -> dict:
    try:
        response = (
            supabase.table("scan_history")
            .select("status, category")
            .eq("session_id", session_id)
            .execute()
        )

        scans = response.data or []
        total = len(scans)

        if total == 0:
            return {
                "total_scans": 0,
                "halal_count": 0,
                "doubtful_count": 0,
                "haram_count": 0,
                "halal_percentage": 0,
                "top_categories": [],
            }

        halal_count = sum(1 for s in scans if s["status"] == "halal")
        doubtful_count = sum(1 for s in scans if s["status"] == "doubtful")
        haram_count = sum(1 for s in scans if s["status"] == "haram")

        category_counts: dict[str, int] = {}
        for scan in scans:
            cat = scan.get("category") or "Unknown"
            category_counts[cat] = category_counts.get(cat, 0) + 1

        top_categories = sorted(
            [{"category": k, "count": v} for k, v in category_counts.items()],
            key=lambda x: x["count"],
            reverse=True,
        )[:5]

        return {
            "total_scans": total,
            "halal_count": halal_count,
            "doubtful_count": doubtful_count,
            "haram_count": haram_count,
            "halal_percentage": round((halal_count / total) * 100),
            "top_categories": top_categories,
        }

    except Exception as e:
        raise StatsError(
            code="STATS_ERROR",
            message=f"Failed to fetch all time stats: {str(e)}",
        )
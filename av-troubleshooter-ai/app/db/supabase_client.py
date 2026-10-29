import logging
import httpx
from typing import Optional, Dict, Any
from app.config import settings

logger = logging.getLogger(__name__)


class SupabaseClient:
    """
    Persistence adapter for Supabase PostgreSQL.
    Stores:
    - av_incidents
    - diagnostic_sessions
    - technician_summaries
    """

    def __init__(self):
        self.url = settings.SUPABASE_URL
        self.key = settings.SUPABASE_KEY
        self.enabled = bool(self.url and self.key)

    async def log_step(self, incident_id: str, step_data: Dict[str, Any]) -> bool:
        if not self.enabled:
            return True  # Mock success when Supabase not configured

        try:
            endpoint = f"{self.url}/rest/v1/diagnostic_steps"
            headers = {
                "apikey": self.key,
                "Authorization": f"Bearer {self.key}",
                "Content-Type": "application/json"
            }
            async with httpx.AsyncClient(timeout=3.0) as client:
                res = await client.post(endpoint, json=step_data, headers=headers)
                return res.status_code in [200, 201]
        except Exception as e:
            logger.warning("Failed to log step to Supabase: %s", e)
            return False

    async def record_escalation(self, summary_data: Dict[str, Any]) -> bool:
        if not self.enabled:
            return True

        try:
            endpoint = f"{self.url}/rest/v1/escalation_tickets"
            headers = {
                "apikey": self.key,
                "Authorization": f"Bearer {self.key}",
                "Content-Type": "application/json"
            }
            async with httpx.AsyncClient(timeout=3.0) as client:
                res = await client.post(endpoint, json=summary_data, headers=headers)
                return res.status_code in [200, 201]
        except Exception as e:
            logger.warning("Failed to record escalation to Supabase: %s", e)
            return False


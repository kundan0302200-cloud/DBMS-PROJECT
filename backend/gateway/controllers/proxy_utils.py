from typing import Any

import httpx
from fastapi import Response


SPRING_BASE_URL = "http://localhost:8001"


FIELD_ALIASES = {
    "resource_id": "resourceId",
    "resource_name": "resourceName",
    "resource_type": "resourceType",
    "total_quantity": "totalQuantity",
    "available_quantity": "availableQuantity",
    "booking_id": "bookingId",
    "user_id": "userId",
    "start_time": "startTime",
    "end_time": "endTime",
    "booking_date": "bookingDate",
    "created_at": "createdAt",
    "updated_at": "updatedAt",
}


def to_spring_payload(value: Any) -> Any:
    if isinstance(value, list):
        return [to_spring_payload(item) for item in value]

    if isinstance(value, dict):
        return {
            FIELD_ALIASES.get(key, key): to_spring_payload(item)
            for key, item in value.items()
        }

    return value


async def forward_response(response: httpx.Response, fastapi_response: Response):
    fastapi_response.status_code = response.status_code
    try:
        return response.json()
    except ValueError:
        return response.text

from typing import Any

from fastapi import APIRouter, Header, Query, Response
import httpx

from controllers.proxy_utils import SPRING_BASE_URL, forward_response, to_spring_payload


router = APIRouter(prefix="/booking")
SPRING_BOOKING_URL = f"{SPRING_BASE_URL}/booking"


@router.get("/test")
async def test_booking(response: Response):
    async with httpx.AsyncClient() as client:
        spring_response = await client.get(f"{SPRING_BOOKING_URL}/test")
    return await forward_response(spring_response, response)


@router.post("/book")
async def book_resource(booking: dict[str, Any], response: Response, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        spring_response = await client.post(
            f"{SPRING_BOOKING_URL}/book",
            json=to_spring_payload(booking),
            headers={"Token": Token},
        )
    return await forward_response(spring_response, response)


@router.get("/mybookings")
async def get_my_bookings(response: Response, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        spring_response = await client.get(
            f"{SPRING_BOOKING_URL}/mybookings",
            headers={"Token": Token},
        )
    return await forward_response(spring_response, response)


@router.get("/all")
async def get_all_bookings(response: Response, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        spring_response = await client.get(
            f"{SPRING_BOOKING_URL}/all",
            headers={"Token": Token},
        )
    return await forward_response(spring_response, response)


@router.get("/getbyresource/{resource_id}")
async def get_bookings_by_resource(
    resource_id: int,
    response: Response,
    Token: str = Header(...),
):
    async with httpx.AsyncClient() as client:
        spring_response = await client.get(
            f"{SPRING_BOOKING_URL}/getbyresource/{resource_id}",
            headers={"Token": Token},
        )
    return await forward_response(spring_response, response)


@router.put("/cancel/{booking_id}")
async def cancel_booking(booking_id: int, response: Response, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        spring_response = await client.put(
            f"{SPRING_BOOKING_URL}/cancel/{booking_id}",
            headers={"Token": Token},
        )
    return await forward_response(spring_response, response)


@router.get("/get/{booking_id}")
async def get_booking_by_id(booking_id: int, response: Response, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        spring_response = await client.get(
            f"{SPRING_BOOKING_URL}/get/{booking_id}",
            headers={"Token": Token},
        )
    return await forward_response(spring_response, response)


@router.put("/update/{booking_id}")
async def update_booking_status(
    booking_id: int,
    response: Response,
    status: int = Query(...),
    Token: str = Header(...),
):
    async with httpx.AsyncClient() as client:
        spring_response = await client.put(
            f"{SPRING_BOOKING_URL}/update/{booking_id}",
            params={"status": status},
            headers={"Token": Token},
        )
    return await forward_response(spring_response, response)

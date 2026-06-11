from typing import Any

from fastapi import APIRouter, Header, Response
import httpx

from controllers.proxy_utils import SPRING_BASE_URL, forward_response, to_spring_payload


router = APIRouter(prefix="/resource")
SPRING_RESOURCE_URL = f"{SPRING_BASE_URL}/resource"


@router.get("/getall")
async def get_all_resources(response: Response, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        spring_response = await client.get(
            f"{SPRING_RESOURCE_URL}/getall",
            headers={"Token": Token},
        )
    return await forward_response(spring_response, response)


@router.get("/available")
async def get_available_resources(response: Response, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        spring_response = await client.get(
            f"{SPRING_RESOURCE_URL}/available",
            headers={"Token": Token},
        )
    return await forward_response(spring_response, response)


@router.get("/getbyid/{id}")
async def get_resource_by_id(id: int, response: Response, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        spring_response = await client.get(
            f"{SPRING_RESOURCE_URL}/getbyid/{id}",
            headers={"Token": Token},
        )
    return await forward_response(spring_response, response)


@router.post("/add")
async def add_resource(resource: dict[str, Any], response: Response, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        spring_response = await client.post(
            f"{SPRING_RESOURCE_URL}/add",
            json=to_spring_payload(resource),
            headers={"Token": Token},
        )
    return await forward_response(spring_response, response)


@router.put("/update/{id}")
async def update_resource(
    id: int,
    resource: dict[str, Any],
    response: Response,
    Token: str = Header(...),
):
    async with httpx.AsyncClient() as client:
        spring_response = await client.put(
            f"{SPRING_RESOURCE_URL}/update/{id}",
            json=to_spring_payload(resource),
            headers={"Token": Token},
        )
    return await forward_response(spring_response, response)


@router.delete("/delete/{id}")
async def delete_resource(id: int, response: Response, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        spring_response = await client.delete(
            f"{SPRING_RESOURCE_URL}/delete/{id}",
            headers={"Token": Token},
        )
    return await forward_response(spring_response, response)

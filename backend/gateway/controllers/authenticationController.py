from typing import Any

from fastapi import APIRouter, Header, Response
from models.schemas import SigninSchema, SignupSchema
import httpx

from controllers.proxy_utils import SPRING_BASE_URL, forward_response

router = APIRouter(prefix="/authservice")
SPRING_AUTH_URL = f"{SPRING_BASE_URL}/authservice"

@router.post("/signup")
async def signup(U: SignupSchema, response: Response):
    async with httpx.AsyncClient() as client:
        spring_response = await client.post(
            f"{SPRING_AUTH_URL}/signup",
            json=U.model_dump()
        )
    return await forward_response(spring_response, response)

@router.post("/signin")
async def signin(U: SigninSchema, response: Response):
    async with httpx.AsyncClient() as client:
        spring_response = await client.post(
            f"{SPRING_AUTH_URL}/signin",
            json=U.model_dump()
        )
    return await forward_response(spring_response, response)

@router.get("/uinfo")
async def uinfo(response: Response, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        spring_response = await client.get(
            f"{SPRING_AUTH_URL}/uinfo",
            headers={"Token": Token}
        )
    return await forward_response(spring_response, response)


@router.get("/profile")
async def profile(response: Response, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        spring_response = await client.get(
            f"{SPRING_AUTH_URL}/profile",
            headers={"Token": Token}
        )
    return await forward_response(spring_response, response)

@router.get("/getallusers/{page}/{limit}")
async def get_all_users(page: int, limit: int, response: Response, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        spring_response = await client.get(
            f"{SPRING_AUTH_URL}/getallusers/{page}/{limit}",
            headers={"Token": Token}
        )
    return await forward_response(spring_response, response)


@router.get("/getuser/{id}")
async def get_user(id: int, response: Response, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        spring_response = await client.get(
            f"{SPRING_AUTH_URL}/getuser/{id}",
            headers={"Token": Token}
        )
    return await forward_response(spring_response, response)


@router.post("/saveuser")
async def save_user(user: dict[str, Any], response: Response, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        spring_response = await client.post(
            f"{SPRING_AUTH_URL}/saveuser",
            json=user,
            headers={"Token": Token}
        )
    return await forward_response(spring_response, response)


@router.put("/updateuser/{id}")
async def update_user(id: int, user: dict[str, Any], response: Response, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        spring_response = await client.put(
            f"{SPRING_AUTH_URL}/updateuser/{id}",
            json=user,
            headers={"Token": Token}
        )
    return await forward_response(spring_response, response)


@router.delete("/deleteuser/{id}")
async def delete_user(id: int, response: Response, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        spring_response = await client.delete(
            f"{SPRING_AUTH_URL}/deleteuser/{id}",
            headers={"Token": Token}
        )
    return await forward_response(spring_response, response)


@router.get("/searchuser/{KEY}")
async def searchuser(KEY: str, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SPRING_AUTH_URL}/searchuser/{KEY}",
            headers={"Token": Token}
        )
    return response.json()

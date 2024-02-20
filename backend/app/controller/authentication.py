# from app.repository.users import UsersRepository
from fastapi import APIRouter, HTTPException

from fastapi.security import OAuth2PasswordBearer

from app.schema import RegisterSchema, ResponseSchema, ForgotPasswordSchema, LoginSchema
from app.service.authentication_service import AuthService


router = APIRouter(prefix="/auth", tags=['Authentication'])


@router.post("/register/user", response_model=ResponseSchema, response_model_exclude_none=True)
async def register(request_body: RegisterSchema):
    await AuthService.register_service(request_body)
    return ResponseSchema(detail="Successfully save data!")


@router.post("/login/user", response_model=ResponseSchema)
async def login(requset_body: LoginSchema):
    token = await AuthService.logins_service(requset_body)
    return ResponseSchema(detail="Successfully login", result={"token_type": "Bearer", "access_token": token})


@router.post("/forgot-password", response_model=ResponseSchema, response_model_exclude_none=True)
async def forgot_password(request_body: ForgotPasswordSchema):
    await AuthService.forgot_password_service(request_body)
    return ResponseSchema(detail="Successfully update data!")
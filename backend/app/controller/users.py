from typing import List
from fastapi import APIRouter, Depends, Security, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.future import select
from app.schema import ResponseSchema
from app.repository.auth_repo import JWTBearer, JWTRepo
from app.service.users_service import UserService



#from app.model.workflowprocess import Course


#Email
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import BaseModel, EmailStr
from starlette.responses import JSONResponse
from werkzeug.security import check_password_hash, generate_password_hash
# from app.main import conf

router = APIRouter(
    prefix="/user",
    tags=['user'],
    dependencies=[Depends(JWTBearer())]
)

@router.get("/profile/user", response_model=ResponseSchema, response_model_exclude_none=True)
async def get_student_profile(credentials: HTTPAuthorizationCredentials = Security(JWTBearer())):
    token = JWTRepo.extract_token(credentials)

    user_id = token['id']
    result = await UserService.get_user_profile_id(user_id)
    if result:
        return ResponseSchema(detail="Successfully fetch student profile!", result=result)
    else:
        raise HTTPException(status_code=404, detail="Student profile not found")




@router.get("/profile/admin", response_model=ResponseSchema, response_model_exclude_none=True)
async def get_faculty_profile(credentials: HTTPAuthorizationCredentials = Security(JWTBearer())):
    token = JWTRepo.extract_token(credentials)
    user_id = token['id']

    result = await UserService.get_faculty_profile(user_id)


    if result:
        result_dict = dict(result)
        return ResponseSchema(detail="Successfully fetch faculty profile!", result=result_dict)
    else:
        raise HTTPException(status_code=404, detail="Faculty profile not found")
    



# @router.post("/user/reset-password")
# async def forgot_password(
#     email: ForgotPassword, 
#     credentials: HTTPAuthorizationCredentials = Security(JWTBearer())):
    
#     token = JWTRepo.extract_token(credentials)
#     user_id = token['user_id']
      
#     message = MessageSchema(
#         subject="Password Reset",
#         recipients=[result.Email],
#         body=f"""You have successfully reset your password 
        
#         This is your new password:
#         <b>{email.new_password}</>""",
#         subtype=MessageType.html
#     )

#     fm = FastMail(conf)
#     await fm.send_message(message)
    
#     return {"message": "Password reset successfully. We also sent your password to your email"}


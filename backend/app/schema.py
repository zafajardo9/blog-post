from datetime import datetime
from fastapi import HTTPException
import logging
import re
from typing import Any, Dict, List, TypeVar, Optional, Generic, Union

from pydantic import BaseModel, Field, validator, constr


T = TypeVar('T')

# get root logger
logger = logging.getLogger(__name__)


class RegisterSchema(BaseModel):

    username: str
    email: str
    password: str
    
    firstName: str
    lastName: str
    middleName: str
    mobileNumber: str
    dateOfBirth: str

    # phone number validation

    @validator("mobileNumber")
    def phone_validation(cls, v):
        # regex phone number for the Philippines
        regex = r"^(09|\+639)\d{9}$"
        if v and not re.match(regex, v):
            raise HTTPException(status_code=400, detail="Invalid input phone number!")
        return v



class LoginSchema(BaseModel):
    username: str
    password: str


class ForgotPasswordSchema(BaseModel):
    email: str
    new_password: str


class DetailSchema(BaseModel):
    status: str
    message: str
    result: Optional[T] = None


class ResponseSchema(BaseModel):
    detail: str
    result: Optional[T] = None
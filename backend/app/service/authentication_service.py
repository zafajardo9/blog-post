import base64
from datetime import datetime
from uuid import uuid4
from fastapi import HTTPException

from app.models import Person, Users


from passlib.context import CryptContext
from app.schema import RegisterSchema, LoginSchema, ForgotPasswordSchema
from app.repository.auth_repo import JWTRepo

from app.config import db
from sqlalchemy import select


from werkzeug.security import generate_password_hash, check_password_hash

from app.repository.users_repo import UsersRepository
from app.repository.person_repo import PersonRepository


class AuthService:
    @staticmethod
    async def register_service(register: RegisterSchema):

        # Create uuid
        _person_id = str(uuid4())
        _users_id = str(uuid4())


        birth_date = datetime.strptime(register.dateOfBirth, '%d-%m-%Y')

        _person = Person(
            id=_person_id, 
            firstName=register.username, 
            lastName=register.lastName,    
            middleName=register.middleName,
            dateOfBirth=birth_date,
            mobileNumber = register.mobileNumber
            
        )
        _users = Users(
            id=_users_id, 
            username=register.username, 
            email=register.email,    
            password=generate_password_hash(register.password),
            person_id=_person_id
        )
        
        _username = await UsersRepository.find_by_username(register.username)
        if _username:
            raise HTTPException(
                status_code=400, detail="Username already exists!")

        _email = await UsersRepository.find_by_email(register.email)
        if _email:
            raise HTTPException(
                status_code=400, detail="Email already exists!")

        else:
            #  insert to tables
            await PersonRepository.create(**_person.dict())
            await UsersRepository.create(**_users.dict())

    @staticmethod
    async def logins_service(login: LoginSchema):
        _username = await UsersRepository.find_by_username(login.username)
        print(_username)
        if _username is not None:
            if not check_password_hash(_username.password, login.password):
                raise HTTPException(
                    status_code=400, detail="Invalid Password !")
            return JWTRepo(data={"username": _username.username, "id": _username.id}).generate_token()
        raise HTTPException(status_code=404, detail="Username not found !")


    




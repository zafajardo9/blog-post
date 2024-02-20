from typing import List, Optional
from sqlalchemy import and_, select
from sqlalchemy import insert
from sqlalchemy import update
from sqlalchemy import delete
from app.config import commit_rollback, db
from app.models import Users, Person
from app.repository.base_repo import BaseRepo


class UsersRepository(BaseRepo):
    model = Users
    
    
    @staticmethod
    async def find_by_username(username: str):
        query = select(Users).where(Users.username == username)
        return (await db.execute(query)).scalar_one_or_none()

    @staticmethod
    async def find_by_email(email: str):
        query = select(Users).where(Users.email == email)
        return (await db.execute(query)).scalar_one_or_none()

    @staticmethod
    async def update_password(email: str, password: str):
        query = update(Users).where(Users.email == email).values(
            password=password).execution_options(synchronize_session="fetch")
        await db.execute(query)
        await commit_rollback()
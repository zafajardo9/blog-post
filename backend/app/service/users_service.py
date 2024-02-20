from sqlalchemy import case, desc, distinct, func, or_, outerjoin, select, and_

from app.models import Users, Person

from app.config import db



class UserService:
    
    @staticmethod
    async def get_user_profile_id(id:str):
        query = (
            select(
                Users.id,
                Users.username, 
                Users.email, 
                func.concat(Person.firstName, ' ', Person.middleName, '. ', Person.lastName).label('name'),
                Person.dateOfBirth,
                Person.mobileNumber
                        )
            .join(Users, Users.person_id == Person.id).where(Users.id == id)
        )
        
        result = await db.execute(query)
        result = result.mappings().first()
        
        custom_result = {
            "id": result.id,
            "username": result.username,
            "email": result.email,
            "name": result.name,
            "dateOfBirth": result.dateOfBirth,
            "mobileNumber": result.mobileNumber,
        }
        return custom_result
    
    @staticmethod
    async def get_user_profile(username:str):
        query = (
            select(
                Users.id,
                Users.username, 
                Users.email, 
                func.concat(Person.firstName, ' ', Person.middleName, '. ', Person.lastName).label('name'),
                Person.dateOfBirth,
                Person.mobileNumber
                        )
            .join(Users, Users.person_id == Person.id).where(Users.username == username)
        )
        
        result = await db.execute(query)
        result = result.mappings().first()
        
        custom_result = {
            "id": result.id,
            "username": result.username,
            "email": result.email,
            "name": result.name,
            "dateOfBirth": result.dateOfBirth,
            "mobileNumber": result.mobileNumber,
        }
        return custom_result
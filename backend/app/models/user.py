from typing import List, Optional
from sqlalchemy import Column, String
from sqlmodel import SQLModel, Field, Relationship

from app.models.mixins import TimeMixin
from datetime import datetime
from sqlalchemy import Column, DateTime

class Users(SQLModel, TimeMixin, table=True):
    __tablename__ = "Users"



    created_at: datetime = Field(default_factory=datetime.now)
    modified_at: datetime = Field(
        sa_column=Column(DateTime, default=datetime.now,
                         onupdate=datetime.now, nullable=False)
    )
    
    
    id: str = Field(primary_key=True, nullable=False)

    username: str
    email: str
    password: str
    
    
    person_id: str = Field(default=None, foreign_key="Person.id")
    person: "Person" = Relationship(back_populates="users")
    
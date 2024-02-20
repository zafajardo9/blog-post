from datetime import date
from typing import Optional
from sqlalchemy import Enum, table
from sqlmodel import SQLModel, Field, Relationship



from app.models.mixins import TimeMixin
from datetime import datetime
from sqlalchemy import Column, DateTime

class Person(SQLModel, TimeMixin, table=True):
    __tablename__ = "Person"
    
    created_at: datetime = Field(default_factory=datetime.now)
    modified_at: datetime = Field(
        sa_column=Column(DateTime, default=datetime.now,
                         onupdate=datetime.now, nullable=False)
    )
    
    id: str = Field(primary_key=True, nullable=False)
    firstName: str
    lastName: str
    middleName: str
    dateOfBirth: date
    mobileNumber: str
    
    
    users: "Users" = Relationship(
        sa_relationship_kwargs={'uselist': False}, back_populates="person")
    
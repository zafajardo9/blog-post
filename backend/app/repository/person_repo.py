from app.models.person import Person
from app.repository.base_repo import BaseRepo

class PersonRepository(BaseRepo):
    model = Person
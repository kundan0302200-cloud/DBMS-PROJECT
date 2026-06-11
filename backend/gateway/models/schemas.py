from pydantic import BaseModel
class SignupSchema(BaseModel):
   fullname: str
   phone: str
   email: str
   password: str

class SigninSchema(BaseModel):
    username: str
    password: str


class TasksSchema(BaseModel):
    title: str
    description: str
    createdby: int = 0
    assignedto: int
    priority: int
    deadline: str
    status: int       
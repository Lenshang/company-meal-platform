from pydantic import BaseModel
from typing import Optional


class SystemUser(BaseModel):
    id: Optional[int] = -1
    username: str
    password: Optional[str]
    mobile: Optional[str]
    old_password: Optional[str]
    role_id: Optional[int] = 2
    status: Optional[int] = 10

    class Config:
        orm_mode = True


class UserInfo(BaseModel):
    id: Optional[int] = -1
    username: str
    mobile: Optional[str]
    status: Optional[int] = 10
    role_id: Optional[int] = 3
    role: Optional[str]


class CurrUserInfo(BaseModel):
    password: str

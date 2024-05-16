from pydantic import BaseModel
from typing import Optional
class SystemMenu(BaseModel):
    id:Optional[int]=-1
    parent_id:Optional[int]=0
    priority:Optional[int]=100
    name:str
    icon:Optional[str]=""
    path:str
    auth:Optional[str]=""
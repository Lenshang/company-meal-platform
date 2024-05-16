from pydantic import BaseModel
from typing import Optional


class MealMenu(BaseModel):
    date: int
    meal_type: int
    meal_area: str
    name: str
    description: Optional[str] = ""
    image: Optional[str] = ""
    visible: Optional[int] = 1

    class Config:
        orm_mode = True

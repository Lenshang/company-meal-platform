import asyncio
from fastapi import APIRouter, File, Query, UploadFile, Depends, HTTPException, WebSocket, WebSocketDisconnect, status
from typing import Union
from sqlalchemy.orm import Session
from config import get_config
from controller.auth_controller import curr_user
from core.db_core import get_db
from core.router_core import create_router
from core import handler_meal_order

router = create_router("meal-order", True)


@router.post("/update")
def update(date: int, meal_type: int, menu_id: str = "", curr_user=Depends(curr_user), db: Session = Depends(get_db)):
    return handler_meal_order.update(menu_id, date, meal_type, curr_user, db)


@router.post("/get_user_order")
def create(date: int, curr_user=Depends(curr_user), db: Session = Depends(get_db)):
    return handler_meal_order.get_user_order(date, curr_user, db)

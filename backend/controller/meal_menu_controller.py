import asyncio
from fastapi import APIRouter, File, Query, UploadFile, Depends, HTTPException, WebSocket, WebSocketDisconnect, status
from typing import Union
from sqlalchemy.orm import Session
from config import get_config
from core.db_core import get_db
from core.router_core import create_router
from core import handler_meal_menu
from model.schema_meal_menu import MealMenu

router = create_router("meal-menu", True)


@router.get("/query")
def query(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    ret, ct = handler_meal_menu.query(db, skip, limit)
    return {"data": ret, "count": ct, "skip": skip, "limit": limit}


@router.post("/update")
def update(item: MealMenu, db: Session = Depends(get_db)):
    return handler_meal_menu.update(item, db)


@router.post("/hide")
def create(id: str, db: Session = Depends(get_db)):
    return handler_meal_menu.hide(id, db)


@router.post("/show")
def create(id: str, db: Session = Depends(get_db)):
    return handler_meal_menu.show(id, db)

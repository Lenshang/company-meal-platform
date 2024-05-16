from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.db_core import get_db
from core.router_core import create_router
from core import handler_system_menu
from typing import List
from model.schema_system_menu import SystemMenu

router = create_router("/system-menu", True, [1])


@router.get("/menu-list")
def menu_list(db: Session = Depends(get_db)):
    return handler_system_menu.get(db)


@router.put("/add")
def add(data: SystemMenu, db: Session = Depends(get_db)):
    return handler_system_menu.add(db, data)


@router.put("/update")
def update(data: SystemMenu, db: Session = Depends(get_db)):
    return handler_system_menu.update(db, data)


@router.put("/update-priority")
def update(datas: List[SystemMenu], db: Session = Depends(get_db)):
    return handler_system_menu.update_priority(db, datas)


@router.get("/delete")
def update(id: str, db: Session = Depends(get_db)):
    try:
        return handler_system_menu.delete(db, id)
    except Exception as e:
        raise HTTPException(500, str(e))


menu_router = router

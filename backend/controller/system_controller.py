from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from core.db_core import get_db

from model.schema_system_user import SystemUser
from core import handler_user
from core.router_core import create_router
router = create_router("system",True,[1])

@router.get("/user-list")
def user_list(
        skip:int=0,limit:int=10,
        name:str="",
        mobile:str="",
        db: Session = Depends(get_db)):
    items=handler_user.get(db,skip,limit,name=name,mobile=mobile)
    count=handler_user.count(db,name=name,mobile=mobile)
    return {
        "data":items,
        "count":count,
        "skip":skip,
        "limit":limit
    }

@router.get("/role-list")
def role_list(db: Session = Depends(get_db)):
    return handler_user.get_role(db)

@router.put("/create-user")
def create_user(user:SystemUser,db: Session = Depends(get_db)):
    _user=handler_user.get_by_username(db,user.username)
    if _user:
        raise HTTPException(status_code=400, detail="已存在相同的用户名")
    try:
        return handler_user.create(db,user)
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))

@router.put("/update-user")
def update_user(user:SystemUser,db: Session = Depends(get_db)):
    try:
        return handler_user.update(db,user)
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))
system_router=router
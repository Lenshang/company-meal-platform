from datetime import timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from model.db_system_user import SystemUser as DbSystemUser
from core.db_core import get_db
from core import handler_auth, handler_system_menu, handler_user
from model.schema_system_user import CurrUserInfo, UserInfo
from config import get_config
import jwt

router = APIRouter()
oauth = OAuth2PasswordBearer(tokenUrl="/api/auth/token")


def _curr_user(db: Session = Depends(get_db), token: str = Depends(oauth)):
    try:
        data = handler_auth.decode_access_token(token)
        return handler_user.get_by_username(db, data["username"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})
    except jwt.PyJWTError:
        raise HTTPException(401, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})


def curr_user(user: UserInfo = Depends(_curr_user)):
    if user.status == 99:
        raise HTTPException(status_code=400, detail="该用户已被禁用")
    return user


def check_user(page_name: str, white: List[int], black: List[int], user: UserInfo = Depends(curr_user), db: Session = Depends(get_db)):
    if white and user.role_id not in white:
        raise HTTPException(status_code=400, detail="用户权限不足")
    if black and user.role_id in black:
        raise HTTPException(status_code=400, detail="用户权限不足")

    # if user.role == "admin":
    #     return user
    # if page_name[0] != "/":
    #     page_name = "/"+page_name
    # menus = handler_system_menu.get(db)
    # role_menu = list(map(lambda x: x.path, filter(
    #     lambda x: str(user.role_id) in x.auth.split(","), menus)))

    # if page_name not in role_menu:
    #     raise HTTPException(status_code=400, detail="用户权限不足")
    return user


@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    _user: DbSystemUser = handler_auth.check_user(db, form_data.username, form_data.password)
    if _user:
        expires = timedelta(hours=24)
        access_token = handler_auth.create_access_token({"username": _user.username}, expires)
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        raise HTTPException(status_code=401, detail="Incorrect username or password", headers={"WWW-Authenticate": "Bearer"})


@router.get("/info")
async def info(curr_user=Depends(curr_user)):
    return curr_user


@router.get("/menu-list")
def menu_list(db: Session = Depends(get_db), curr_user=Depends(curr_user)):
    return handler_system_menu.get(db)


@router.put("/update-info")
async def update_info(data: CurrUserInfo, curr_user=Depends(curr_user), db: Session = Depends(get_db)):
    try:
        handler_user.update_curr(db, data, curr_user)
        return curr_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


auth_router = router

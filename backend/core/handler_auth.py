from datetime import timedelta, datetime
import hashlib
import jwt
from typing import Optional
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session, aliased
from sqlalchemy import desc
from config import get_config
from model.db_system_user import SystemUser as User
from model.db_system_role import SystemRole as Role

oauth = OAuth2PasswordBearer(tokenUrl="/auth/token")


def _parse_password(psw):
    psw = "c-y" + psw + "$a&ms*20)24"
    return hashlib.sha1(psw.encode("utf-8")).hexdigest()


def check_user(db: Session, username: str, password: str):
    db_item = db.query(User).filter(User.username == username).filter(User.password == _parse_password(password)).first()
    return db_item


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, get_config().SIGN_SECRET, algorithm="HS256")
    return encoded_jwt


def decode_access_token(token: str):
    return jwt.decode(token, get_config().SIGN_SECRET, algorithms=["HS256"])

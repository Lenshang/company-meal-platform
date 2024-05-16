from sqlalchemy.orm import Session, aliased
from sqlalchemy import desc

from model.db_system_user import SystemUser as User
from model.db_system_role import SystemRole as Role
from model.schema_system_user import SystemUser as SchSystemUser, UserInfo as SchUserInfo, CurrUserInfo as SchCurrUserInfo
from .handler_auth import check_user, _parse_password


def _query_filter(db: Session, **args):
    q = db.query(
        User.id, User.username, User.mobile, User.status, User.role_id, Role.name.label("role"), User.created_time, User.update_time
    ).join(Role, User.role_id == Role.id)
    if args.get("name"):
        q = q.filter(User.username.like(f"%{args['name']}%"))
    if args.get("mobile"):
        q = q.filter(User.mobile.like(f"%{args['mobile']}%"))
    q = q.order_by(desc(User.update_time))
    return q


def get(db: Session, skip: int = 0, limit: int = 10, **args):
    q = _query_filter(db, **args)
    result = q.offset(skip).limit(limit).all()
    return result


def get_role(db: Session):
    return db.query(Role).all()


def count(db: Session, **args):
    q = _query_filter(db, **args)
    return q.count()


def get_by_username(db: Session, username: str):
    dbItem = (
        db.query(User.id, User.username, User.mobile, User.status, User.role_id, Role.name.label("role"))
        .join(Role, User.role_id == Role.id)
        .filter(User.username == username)
        .first()
    )
    # return SchUserInfo(**dbItem)
    return dbItem


def create(db: Session, data: SchSystemUser):
    if len(data.password) > 32 or len(data.username) > 32:
        raise Exception("用户名或密码格式不正确!")
    db_item = User(
        username=data.username, password=_parse_password(data.password), mobile=data.mobile, role_id=data.role_id, status=data.status
    )
    db_item.id = None
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return {"username": db_item.username, "id": db_item.id}


def update(db: Session, data: SchSystemUser):
    update_item = {"username": data.username, "status": data.status, "mobile": data.mobile, "role_id": data.role_id}
    if data.password:
        # if not check_user(db,data.username,data.old_password):
        #     raise Exception("密码错误!")
        update_item["password"] = _parse_password(data.password)
    db_item = db.query(User).filter_by(id=data.id).update(update_item)
    db.commit()


def update_curr(db: Session, data: SchCurrUserInfo, info: SchUserInfo):
    db.query(User).filter_by(id=info.id).update({"password": _parse_password(data.password)})
    db.commit()

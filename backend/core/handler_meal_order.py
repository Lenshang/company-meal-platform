from sqlalchemy.orm import Session, query as _query, aliased
from sqlalchemy import func, desc
from config import get_config
from core.db_core import get_db
from core.router_core import create_router
from model.db_meal_order import MealOrder
from model.db_meal_menu import MealMenu
from model.db_system_user import SystemUser
import hashlib


def query(db: Session, skip=0, limit=10):
    q: _query.Query = db.query(MealOrder)
    ret = q.order_by(desc(MealOrder.created_time)).offset(skip).limit(limit).all()
    return ret, q.count()


def update(menu_id: str, date: int, meal_type: int, user: SystemUser, db: Session):
    if not menu_id:  # 为空时删除订单
        record = db.query(MealOrder).filter_by(username=user.username, date=date, meal_type=meal_type).first()
        db.delete(record)
    else:
        meal = db.query(MealMenu).filter_by(id=menu_id, meal_type=meal_type, date=date).first()
        if not meal:
            raise Exception("没有找到这个餐品！")
        item = MealOrder(username=user.username, date=date, meal_type=meal_type, menu_id=menu_id)
        db.merge(item)
    db.commit()


def get_user_order(date: int, user: SystemUser, db: Session):
    q: _query.Query = db.query(MealOrder)
    ret = q.filter_by(username=user.username, date=date).all()
    return ret

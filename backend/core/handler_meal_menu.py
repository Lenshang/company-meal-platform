from sqlalchemy.orm import Session, query as _query, aliased
from sqlalchemy import func, desc
from config import get_config
from core.db_core import get_db
from core.router_core import create_router
from model.db_meal_menu import MealMenu
from model.schema_meal_menu import MealMenu as SchMealMenu
import hashlib


def query(db: Session, skip=0, limit=10):
    q: _query.Query = db.query(MealMenu)
    ret = q.order_by(desc(MealMenu.created_time)).offset(skip).limit(limit).all()
    return ret, q.count()


def update(item: SchMealMenu, db: Session):
    if not item.name:
        raise Exception("name is required")
    if item.meal_type not in [1, 2, 3]:
        raise Exception("meal_type is incorrect")
    # 计算ID
    id = hashlib.md5(("%s_%s_%s_%s" % (item.date, item.meal_type, item.meal_area, item.name)).encode("utf-8")).hexdigest()
    db.merge(MealMenu(id=id, **item.model_dump()))
    db.commit()


def hide(id: str, db: Session):
    db.query(MealMenu).filter_by(id=id).update({"visible": 0})
    db.commit()


def show(id: str, db: Session):
    db.query(MealMenu).filter_by(id=id).update({"visible": 1})
    db.commit()

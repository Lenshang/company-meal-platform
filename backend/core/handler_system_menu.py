from sqlalchemy.orm import Session,aliased
from sqlalchemy import desc
from typing import List
from model.db_system_menu import SystemMenu as DbSystemMenu
from model.schema_system_menu import SystemMenu as SchSystemMenu

def get(db:Session):
    return db.query(DbSystemMenu).order_by(DbSystemMenu.priority).all()

def add(db:Session,data:SchSystemMenu):
    db_item=DbSystemMenu(**data.dict())
    db_item.id=None
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update(db:Session,data:SchSystemMenu):
    db_item=(db.query(DbSystemMenu)
        .filter_by(id=data.id)
        .update(data.dict()))
    db.commit()
    return db_item

def update_priority(db:Session,datas:List[SchSystemMenu]):
    for item in datas:
        db.query(DbSystemMenu).filter_by(id=item.id).update({
            "priority":item.priority,
            "parent_id":item.parent_id
        })
    db.commit()

def delete(db:Session,id:str):
    if db.query(DbSystemMenu).filter(DbSystemMenu.parent_id==id).count()>0:
        raise Exception("存在子菜单的菜单无法删除!请先删除子菜单!")
    db.query(DbSystemMenu).filter_by(id=id).delete()
    db.commit()
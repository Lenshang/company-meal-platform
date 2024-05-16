# coding: utf-8
from sqlalchemy import CHAR, Column, String, TIMESTAMP, text, func, TEXT, SMALLINT
from sqlalchemy.dialects.mysql import INTEGER, SMALLINT
from model import Base


class MealOrder(Base):
    __tablename__ = "meal_order"
    username = Column(String(32), primary_key=True, comment="用户id")
    date = Column(INTEGER(8), primary_key=True, comment="日期")
    meal_type = Column(SMALLINT, primary_key=True, comment="餐别 1=早餐 2=午餐 3=晚餐")
    menu_id = Column(String(32), nullable=False, comment="菜单id")
    created_time = Column(TIMESTAMP, nullable=False, server_default=func.now())
    update_time = Column(TIMESTAMP, nullable=False, server_default=func.now(), onupdate=func.now())

# coding: utf-8
from sqlalchemy import CHAR, Column, String, TIMESTAMP, text, func, TEXT, SMALLINT, LargeBinary
from sqlalchemy.dialects.mysql import INTEGER, SMALLINT
from model import Base


class MealMenu(Base):
    __tablename__ = "meal_menu"
    id = Column(String(32), primary_key=True)
    date = Column(INTEGER(8), nullable=False, comment="日期")
    meal_type = Column(SMALLINT, nullable=False, comment="餐别 1=早餐 2=午餐 3=晚餐")
    meal_area = Column(String(32), nullable=False, comment="餐区")
    name = Column(String(32), nullable=False, comment="餐名")
    description = Column(TEXT, nullable=True, comment="描述")
    image = Column(TEXT, nullable=True, comment="图片路径")
    visible = Column(SMALLINT, nullable=False, comment="是否可见 0=不可见 1=可见", server_default=text("'1'"))
    created_time = Column(TIMESTAMP, nullable=False, server_default=func.now())
    update_time = Column(TIMESTAMP, nullable=False, server_default=func.now(), onupdate=func.now())

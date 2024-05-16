# coding: utf-8
from sqlalchemy import CHAR, Column, String, TIMESTAMP, text, func, TEXT
from sqlalchemy.dialects.mysql import INTEGER, SMALLINT
from model import Base


class ModelAgent(Base):
    __tablename__ = "model_agent"

    name = Column(String(32), primary_key=True, comment="智能体名称")
    description = Column(TEXT, nullable=True, comment="描述")
    base_model = Column(String(32), nullable=False, comment="基础模型")
    tools = Column(TEXT, nullable=True, comment="工具清单")
    created_time = Column(TIMESTAMP, nullable=False, server_default=func.now())
    update_time = Column(TIMESTAMP, nullable=False, server_default=func.now(), onupdate=func.now())

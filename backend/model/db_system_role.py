# coding: utf-8
from sqlalchemy import Column, String, TIMESTAMP, text, func
from sqlalchemy.dialects.mysql import INTEGER
from model import Base


class SystemRole(Base):
    __tablename__ = "system_role"

    id = Column(INTEGER(11), primary_key=True, comment="角色ID")
    name = Column(String(64), nullable=False, comment="角色名称")
    tag = Column(String(64), server_default=text("''"), comment="角色标识")
    description = Column(String(256), server_default=text("''"), comment="描述")
    createdTime = Column(TIMESTAMP, nullable=False, server_default=func.now())
    update_time = Column(TIMESTAMP, nullable=False, server_default=func.now(), onupdate=func.now())

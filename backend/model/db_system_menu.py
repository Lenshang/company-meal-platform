# coding: utf-8
from sqlalchemy import Column, String, text
from sqlalchemy.dialects.mysql import INTEGER
from model import Base


class SystemMenu(Base):
    __tablename__ = "system_menu"

    id = Column(INTEGER(11), primary_key=True)
    parent_id = Column(INTEGER(11), nullable=False, server_default=text("'0'"))
    priority = Column(INTEGER(11), nullable=False, server_default=text("'100'"))
    name = Column(String(50), nullable=False, server_default=text("''"))
    icon = Column(String(50), nullable=False, server_default=text("''"))
    path = Column(String(256), nullable=False)
    auth = Column(String(64))

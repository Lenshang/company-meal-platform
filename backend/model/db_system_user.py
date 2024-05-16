# coding: utf-8
from sqlalchemy import CHAR, Column, String, TIMESTAMP, text, func
from sqlalchemy.dialects.mysql import INTEGER, SMALLINT
from model import Base


class SystemUser(Base):
    __tablename__ = "system_user"

    id = Column(INTEGER(10), primary_key=True)
    username = Column(String(32), nullable=False, unique=True)
    password = Column(String(40), nullable=False)
    role_id = Column(INTEGER(11), nullable=False, server_default=text("'0'"))
    mobile = Column(String(32), nullable=True, unique=False, server_default=text("''"))
    status = Column(SMALLINT(6), nullable=False, server_default=text("'10'"))
    created_time = Column(TIMESTAMP, nullable=False, server_default=func.now())
    update_time = Column(TIMESTAMP, nullable=False, server_default=func.now(), onupdate=func.now())

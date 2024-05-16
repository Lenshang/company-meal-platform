from sqlalchemy import create_engine
from sqlalchemy.engine.mock import MockConnection
from sqlalchemy.orm import sessionmaker, Session
from config import get_config

SessionLocal = sessionmaker(bind=create_engine(get_config().MYSQL, pool_recycle=7200), autoflush=False, autocommit=False)


def get_db() -> Session:
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

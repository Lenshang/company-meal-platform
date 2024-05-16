import os
import importlib
import inspect
from pydantic import BaseModel
from functools import lru_cache

env = os.getenv("ENV")


def _import(name):
    try:
        dic = importlib.import_module(name, __package__).__dict__
        r = {}
        for key in dic.keys():
            if len(key) > 1 and key[0:2] == "__":
                continue
            elif inspect.ismodule(dic[key]):
                continue
            r[key] = dic[key]
        return r
    except ImportError as e:
        return None


class Settings(BaseModel):
    MYSQL: str
    SIGN_SECRET: str


_config = None


def get_config() -> Settings:
    global _config
    if _config:
        return _config
    if env == "prod":
        _config = Settings(**_import(".config_prod"))
    elif env == "test":
        _config = Settings(**_import(".config_test"))
    else:
        _config = Settings(**_import(".config_dev"))
    return _config

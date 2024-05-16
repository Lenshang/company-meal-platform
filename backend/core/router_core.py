from controller.auth_controller import check_user
from functools import partial
from fastapi import APIRouter, Depends


def create_router(page_name: str, login=True, white=[], black=[]):
    if login:
        return APIRouter(dependencies=[Depends(partial(check_user, page_name, white, black))])
    else:
        return APIRouter()

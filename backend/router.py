from fastapi import APIRouter
from controller.main_controller import main_router
from controller.auth_controller import auth_router
from controller.system_menu_controller import menu_router
from controller.system_controller import system_router
from controller.meal_menu_controller import router as meal_menu_router
from controller.meal_order_controller import router as meal_order_router

api_router = APIRouter()
api_router.include_router(main_router, prefix="/main", tags=["Main"])
api_router.include_router(auth_router, prefix="/auth", tags=["授权"])
api_router.include_router(menu_router, prefix="/menu", tags=["菜单管理"])
api_router.include_router(system_router, prefix="/system", tags=["系统"])

api_router.include_router(meal_menu_router, prefix="/meal-menu", tags=["订餐管理"])
api_router.include_router(meal_order_router, prefix="/meal-order", tags=["个人订餐"])

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from config import get_config
from model.db_system_role import SystemRole
from model.db_system_user import SystemUser
from model.db_system_menu import SystemMenu
from model.db_meal_menu import MealMenu
from model.db_meal_order import MealOrder
from core.handler_auth import _parse_password

engine = create_engine(get_config().MYSQL, pool_recycle=7200)
Session = sessionmaker(engine)
session = Session()
if __name__ == "__main__":
    SystemRole.metadata.create_all(engine)
    SystemUser.metadata.create_all(engine)
    SystemMenu.metadata.create_all(engine)

    admin = SystemRole(id=1, name="admin", tag="", description="超级管理员")
    user = SystemRole(id=2, name="user", tag="", description="普通用户")
    session.add_all([admin, user])
    session.commit()

    home = SystemMenu(id=1, parent_id=0, priority=100, name="首页", icon="GlobalOutlined", path="/home", auth="2")
    meal_menu = SystemMenu(id=2, parent_id=0, priority=101, name="订餐管理", icon="ContainerOutlined", path="/meal-menu", auth="")
    meal_order = SystemMenu(id=3, parent_id=0, priority=101, name="订餐", icon="PieChartOutlined", path="/meal-order", auth="2")
    u_admin = SystemUser(username="admin", password=_parse_password("admin"), role_id=1, mobile="10000", status=10)
    session.add_all([home, meal_menu, meal_order, u_admin])
    session.commit()

from contextlib import asynccontextmanager
import uvicorn
import aioredis
from fastapi import FastAPI
from util.logger import getLoggerWithoutFile
from starlette.middleware.cors import CORSMiddleware
from router import api_router
from config import get_config


# def create() -> FastAPI:
#     application = FastAPI(title="CompanyFoodOrder Backend")
#     application.debug = True

#     application.add_middleware(
#         CORSMiddleware,
#         # allow_origins=[get_config().FRONT_URL],
#         allow_origin_regex="https?://.*",
#         allow_credentials=True,
#         allow_methods=["*"],
#         allow_headers=["*"],
#     )

#     @application.on_event("startup")
#     async def create_redis_app():
#         pass

#     @application.on_event("shutdown")
#     async def stop_redis_app():
#         pass

#     application.include_router(api_router, prefix="/api")


#     return application
def create() -> FastAPI:
    @asynccontextmanager
    async def lifespan(app: FastAPI):
        yield

    application = FastAPI(title="CompanyMealPlatform Backend", lifespan=lifespan)
    application.debug = True

    application.add_middleware(
        CORSMiddleware,
        allow_origin_regex="https?://.*",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.include_router(api_router, prefix="/api")

    return application


if __name__ == "__main__":
    logger = getLoggerWithoutFile("company_meal_platform")
    app = create()
    logger.info("company_meal_platform backend start")
    uvicorn.run(app, host="0.0.0.0", port=7003)

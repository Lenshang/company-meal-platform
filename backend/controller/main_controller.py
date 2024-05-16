import asyncio
from fastapi import APIRouter, File, Query, UploadFile, Depends, HTTPException, WebSocket, WebSocketDisconnect, status
from typing import Union
from sqlalchemy.orm import Session
from config import get_config
from core.router_core import create_router

router = create_router("main", False)


@router.get("/test")
async def test():
    return "OK"


main_router = router

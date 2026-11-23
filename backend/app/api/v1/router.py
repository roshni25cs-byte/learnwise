from fastapi import APIRouter
from app.api.v1.endpoints import auth, admin, users

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(admin.router, prefix="/admin", tags=["Administrator Management"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])

from fastapi import APIRouter
from app.api.v1.endpoints import auth, admin, users, courses, assessments, ai

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(admin.router, prefix="/admin", tags=["Administrator Management"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(courses.router, prefix="/courses", tags=["Courses & CLOs"])
api_router.include_router(assessments.router, prefix="/assessments", tags=["Assessments & Grading"])
api_router.include_router(ai.router, prefix="/ai", tags=["Gemini AI Engine"])

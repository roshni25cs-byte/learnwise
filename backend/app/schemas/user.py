from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr
from app.models.user import UserRole, ApprovalStatus

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    id: str
    is_active: bool
    is_approved: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class FacultyApprovalDetail(BaseModel):
    id: str
    faculty_id: str
    faculty_name: str
    faculty_email: str
    status: ApprovalStatus
    remarks: Optional[str] = None
    reviewed_by: Optional[str] = None
    reviewer_name: Optional[str] = None
    created_at: datetime
    reviewed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ApprovalActionRequest(BaseModel):
    remarks: Optional[str] = None

from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from app.models.course import BloomsLevel, EnrollmentStatus

class LearningObjectiveBase(BaseModel):
    code: str
    description: str
    blooms_level: BloomsLevel

class LearningObjectiveCreate(LearningObjectiveBase):
    pass

class LearningObjectiveResponse(LearningObjectiveBase):
    id: str
    course_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class ModuleBase(BaseModel):
    title: str
    description: Optional[str] = None
    order_index: int = 1

class ModuleCreate(ModuleBase):
    pass

class ModuleResponse(ModuleBase):
    id: str
    course_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class CourseBase(BaseModel):
    code: str
    title: str
    description: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class CourseResponse(CourseBase):
    id: str
    faculty_id: str
    is_published: bool
    created_at: datetime
    modules: List[ModuleResponse] = []
    clos: List[LearningObjectiveResponse] = []

    class Config:
        from_attributes = True

class EnrollmentResponse(BaseModel):
    id: str
    student_id: str
    course_id: str
    status: EnrollmentStatus
    enrolled_at: datetime

    class Config:
        from_attributes = True

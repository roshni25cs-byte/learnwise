from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.course import Course, CourseEnrollment, Module, LearningObjective, EnrollmentStatus
from app.schemas.course import (
    CourseCreate, CourseResponse, ModuleCreate, ModuleResponse,
    LearningObjectiveCreate, LearningObjectiveResponse, EnrollmentResponse
)
from app.api.deps import get_current_user, RoleChecker

router = APIRouter()
faculty_or_admin = RoleChecker([UserRole.FACULTY, UserRole.ADMIN])

@router.post("/", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
def create_course(
    course_in: CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(faculty_or_admin)
):
    """Create a new course (Faculty / Admin)."""
    existing = db.query(Course).filter(Course.code == course_in.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="A course with this code already exists.")

    new_course = Course(
        code=course_in.code,
        title=course_in.title,
        description=course_in.description,
        faculty_id=current_user.id,
        is_published=True
    )
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

@router.get("/", response_model=List[CourseResponse])
def list_courses(db: Session = Depends(get_db)):
    """List all available courses."""
    return db.query(Course).filter(Course.is_published == True).order_by(Course.created_at.desc()).all()

@router.get("/{course_id}", response_model=CourseResponse)
def get_course(course_id: str, db: Session = Depends(get_db)):
    """Get single course with modules and CLOs."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")
    return course

@router.post("/{course_id}/enroll", response_model=EnrollmentResponse)
def enroll_in_course(
    course_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Enroll a student in a course."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")

    existing = (
        db.query(CourseEnrollment)
        .filter(CourseEnrollment.course_id == course_id, CourseEnrollment.student_id == current_user.id)
        .first()
    )
    if existing:
        return existing

    enrollment = CourseEnrollment(
        student_id=current_user.id,
        course_id=course_id,
        status=EnrollmentStatus.ACTIVE
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment

@router.post("/{course_id}/modules", response_model=ModuleResponse)
def add_module(
    course_id: str,
    module_in: ModuleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(faculty_or_admin)
):
    """Add a module to a course."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")

    module = Module(
        course_id=course_id,
        title=module_in.title,
        description=module_in.description,
        order_index=module_in.order_index
    )
    db.add(module)
    db.commit()
    db.refresh(module)
    return module

@router.post("/{course_id}/clos", response_model=LearningObjectiveResponse)
def define_clo(
    course_id: str,
    clo_in: LearningObjectiveCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(faculty_or_admin)
):
    """Define a Course Learning Objective (CLO) mapped to Bloom's Taxonomy."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")

    clo = LearningObjective(
        course_id=course_id,
        code=clo_in.code,
        description=clo_in.description,
        blooms_level=clo_in.blooms_level
    )
    db.add(clo)
    db.commit()
    db.refresh(clo)
    return clo

@router.get("/{course_id}/clos", response_model=List[LearningObjectiveResponse])
def list_clos(course_id: str, db: Session = Depends(get_db)):
    """List CLOs for a course."""
    return db.query(LearningObjective).filter(LearningObjective.course_id == course_id).order_by(LearningObjective.code).all()

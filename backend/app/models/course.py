import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Enum, ForeignKey, Text, Integer, Float, UniqueConstraint
from sqlalchemy.orm import relationship
from app.models.base import Base

class BloomsLevel(str, enum.Enum):
    REMEMBER = "REMEMBER"
    UNDERSTAND = "UNDERSTAND"
    APPLY = "APPLY"
    ANALYSE = "ANALYSE"
    EVALUATE = "EVALUATE"
    CREATE = "CREATE"

class EnrollmentStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    DROPPED = "DROPPED"

class Course(Base):
    __tablename__ = "courses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    faculty_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    is_published = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    faculty = relationship("User", foreign_keys=[faculty_id])
    modules = relationship("Module", back_populates="course", cascade="all, delete-orphan", order_by="Module.order_index")
    clos = relationship("LearningObjective", back_populates="course", cascade="all, delete-orphan", order_by="LearningObjective.code")
    enrollments = relationship("CourseEnrollment", back_populates="course", cascade="all, delete-orphan")
    materials = relationship("Material", back_populates="course", cascade="all, delete-orphan")
    assessments = relationship("Assessment", back_populates="course", cascade="all, delete-orphan")

class CourseEnrollment(Base):
    __tablename__ = "course_enrollments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    course_id = Column(String(36), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(Enum(EnrollmentStatus), default=EnrollmentStatus.ACTIVE, nullable=False)
    enrolled_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (UniqueConstraint("student_id", "course_id", name="uq_student_course_enrollment"),)

    student = relationship("User", foreign_keys=[student_id])
    course = relationship("Course", back_populates="enrollments")

class Module(Base):
    __tablename__ = "modules"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    course_id = Column(String(36), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    order_index = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    course = relationship("Course", back_populates="modules")
    materials = relationship("Material", back_populates="module")

class LearningObjective(Base):
    """Course Learning Objective (CLO) mapped to Bloom's Taxonomy Level"""
    __tablename__ = "learning_objectives"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    course_id = Column(String(36), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    code = Column(String(50), nullable=False)  # e.g., CLO 1, CLO 2
    description = Column(Text, nullable=False)
    blooms_level = Column(Enum(BloomsLevel), nullable=False, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    course = relationship("Course", back_populates="clos")
    questions = relationship("Question", back_populates="clo")

class Material(Base):
    __tablename__ = "materials"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    course_id = Column(String(36), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    module_id = Column(String(36), ForeignKey("modules.id", ondelete="SET NULL"), nullable=True, index=True)
    title = Column(String(255), nullable=False)
    file_url = Column(String(1024), nullable=False)
    file_type = Column(String(50), nullable=False)  # pdf, pptx, docx
    file_size = Column(Integer, default=0, nullable=False)
    uploaded_by = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    course = relationship("Course", back_populates="materials")
    module = relationship("Module", back_populates="materials")
    uploader = relationship("User", foreign_keys=[uploaded_by])

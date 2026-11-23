import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Enum, ForeignKey, Text, Integer, Float
from sqlalchemy.orm import relationship
from app.models.base import Base
from app.models.course import BloomsLevel

class QuestionType(str, enum.Enum):
    MCQ = "MCQ"
    TRUE_FALSE = "TRUE_FALSE"
    SHORT_ANSWER = "SHORT_ANSWER"
    LONG_ANSWER = "LONG_ANSWER"

class DifficultyLevel(str, enum.Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"

class SubmissionStatus(str, enum.Enum):
    IN_PROGRESS = "IN_PROGRESS"
    SUBMITTED = "SUBMITTED"
    GRADED = "GRADED"

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    course_id = Column(String(36), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    module_id = Column(String(36), ForeignKey("modules.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    instructions = Column(Text, nullable=True)
    duration_minutes = Column(Integer, default=30, nullable=False)
    total_marks = Column(Float, default=100.0, nullable=False)
    passing_marks = Column(Float, default=40.0, nullable=False)
    start_time = Column(DateTime, nullable=True)
    end_time = Column(DateTime, nullable=True)
    is_published = Column(Boolean, default=False, nullable=False, index=True)
    created_by = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    course = relationship("Course", back_populates="assessments")
    questions = relationship("Question", back_populates="assessment", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="assessment", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    assessment_id = Column(String(36), ForeignKey("assessments.id", ondelete="CASCADE"), nullable=True, index=True)
    course_id = Column(String(36), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    module_id = Column(String(36), ForeignKey("modules.id", ondelete="SET NULL"), nullable=True)
    clo_id = Column(String(36), ForeignKey("learning_objectives.id", ondelete="CASCADE"), nullable=False, index=True)
    blooms_level = Column(Enum(BloomsLevel), nullable=False, index=True)
    question_type = Column(Enum(QuestionType), default=QuestionType.MCQ, nullable=False)
    difficulty = Column(Enum(DifficultyLevel), default=DifficultyLevel.MEDIUM, nullable=False)
    prompt = Column(Text, nullable=False)
    marks = Column(Float, default=1.0, nullable=False)
    explanation = Column(Text, nullable=True)
    is_ai_generated = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    assessment = relationship("Assessment", back_populates="questions")
    clo = relationship("LearningObjective", back_populates="questions")
    options = relationship("QuestionOption", back_populates="question", cascade="all, delete-orphan", order_by="QuestionOption.order_index")
    answers = relationship("Answer", back_populates="question")

class QuestionOption(Base):
    __tablename__ = "question_options"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    question_id = Column(String(36), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False, index=True)
    option_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False, nullable=False)
    order_index = Column(Integer, default=0, nullable=False)

    question = relationship("Question", back_populates="options")

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    assessment_id = Column(String(36), ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    started_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    submitted_at = Column(DateTime, nullable=True)
    total_score = Column(Float, default=0.0, nullable=False)
    max_score = Column(Float, default=0.0, nullable=False)
    percentage = Column(Float, default=0.0, nullable=False)
    status = Column(Enum(SubmissionStatus), default=SubmissionStatus.IN_PROGRESS, nullable=False)
    faculty_feedback = Column(Text, nullable=True)

    assessment = relationship("Assessment", back_populates="submissions")
    student = relationship("User", foreign_keys=[student_id])
    answers = relationship("Answer", back_populates="submission", cascade="all, delete-orphan")

class Answer(Base):
    __tablename__ = "answers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    submission_id = Column(String(36), ForeignKey("submissions.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id = Column(String(36), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False, index=True)
    selected_option_id = Column(String(36), ForeignKey("question_options.id", ondelete="SET NULL"), nullable=True)
    text_answer = Column(Text, nullable=True)
    marks_awarded = Column(Float, default=0.0, nullable=False)
    is_evaluated = Column(Boolean, default=False, nullable=False)
    evaluation_notes = Column(Text, nullable=True)

    submission = relationship("Submission", back_populates="answers")
    question = relationship("Question", back_populates="answers")
    selected_option = relationship("QuestionOption", foreign_keys=[selected_option_id])

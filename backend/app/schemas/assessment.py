from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from app.models.course import BloomsLevel
from app.models.assessment import QuestionType, DifficultyLevel, SubmissionStatus

class OptionBase(BaseModel):
    option_text: str
    is_correct: bool = False
    order_index: int = 0

class OptionCreate(OptionBase):
    pass

class OptionResponse(OptionBase):
    id: str

    class Config:
        from_attributes = True

class QuestionBase(BaseModel):
    clo_id: str
    blooms_level: BloomsLevel
    question_type: QuestionType = QuestionType.MCQ
    difficulty: DifficultyLevel = DifficultyLevel.MEDIUM
    prompt: str
    marks: float = 1.0
    explanation: Optional[str] = None

class QuestionCreate(QuestionBase):
    options: List[OptionCreate] = []

class QuestionResponse(QuestionBase):
    id: str
    assessment_id: Optional[str] = None
    course_id: str
    is_ai_generated: bool
    options: List[OptionResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True

class AssessmentBase(BaseModel):
    title: str
    instructions: Optional[str] = None
    duration_minutes: int = 30
    total_marks: float = 100.0
    passing_marks: float = 40.0
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

class AssessmentCreate(AssessmentBase):
    course_id: str
    module_id: Optional[str] = None

class AssessmentResponse(AssessmentBase):
    id: str
    course_id: str
    is_published: bool
    created_by: str
    questions: List[QuestionResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True

class AnswerSubmit(BaseModel):
    question_id: str
    selected_option_id: Optional[str] = None
    text_answer: Optional[str] = None

class SubmissionCreate(BaseModel):
    answers: List[AnswerSubmit]

class AnswerResponse(BaseModel):
    question_id: str
    marks_awarded: float
    is_evaluated: bool
    evaluation_notes: Optional[str] = None

class SubmissionResponse(BaseModel):
    id: str
    assessment_id: str
    student_id: str
    total_score: float
    max_score: float
    percentage: float
    status: SubmissionStatus
    submitted_at: Optional[datetime] = None
    answers: List[AnswerResponse] = []

    class Config:
        from_attributes = True

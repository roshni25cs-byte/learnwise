from typing import List
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.course import Course, LearningObjective
from app.models.assessment import QuestionType, DifficultyLevel
from app.services.ai_service import generate_questions_with_gemini, AIQuestionSchema
from app.api.deps import RoleChecker

router = APIRouter()
faculty_only = RoleChecker([UserRole.FACULTY, UserRole.ADMIN])

class AIQuestionGenerateRequest(BaseModel):
    course_id: str
    clo_id: str
    question_type: QuestionType = QuestionType.MCQ
    difficulty: DifficultyLevel = DifficultyLevel.MEDIUM
    count: int = 3

@router.post("/generate-questions", response_model=List[AIQuestionSchema])
def generate_assessment_questions(
    request: AIQuestionGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(faculty_only)
):
    """
    Generate assessment questions using Gemini API, strictly mapped to CLO and Bloom's Taxonomy.
    Returns structured JSON with prompts, options, correct answers, and cognitive rationale.
    """
    course = db.query(Course).filter(Course.id == request.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")

    clo = db.query(LearningObjective).filter(LearningObjective.id == request.clo_id).first()
    if not clo:
        raise HTTPException(status_code=404, detail="CLO not found.")

    questions = generate_questions_with_gemini(
        course_title=course.title,
        clo_code=clo.code,
        clo_description=clo.description,
        blooms_level=clo.blooms_level.value,
        question_type=request.question_type.value,
        difficulty=request.difficulty.value,
        count=request.count
    )

    return questions

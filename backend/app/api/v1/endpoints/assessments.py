from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.course import Course, LearningObjective
from app.models.assessment import (
    Assessment, Question, QuestionOption, Submission, Answer,
    SubmissionStatus, QuestionType
)
from app.schemas.assessment import (
    AssessmentCreate, AssessmentResponse, QuestionCreate, QuestionResponse,
    SubmissionCreate, SubmissionResponse
)
from app.api.deps import get_current_user, RoleChecker

router = APIRouter()
faculty_only = RoleChecker([UserRole.FACULTY, UserRole.ADMIN])

@router.post("/", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
def create_assessment(
    assessment_in: AssessmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(faculty_only)
):
    """Create a new course assessment (Faculty)."""
    course = db.query(Course).filter(Course.id == assessment_in.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")

    assessment = Assessment(
        course_id=assessment_in.course_id,
        module_id=assessment_in.module_id,
        title=assessment_in.title,
        instructions=assessment_in.instructions,
        duration_minutes=assessment_in.duration_minutes,
        total_marks=assessment_in.total_marks,
        passing_marks=assessment_in.passing_marks,
        start_time=assessment_in.start_time,
        end_time=assessment_in.end_time,
        is_published=False,
        created_by=current_user.id
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment

@router.get("/", response_model=List[AssessmentResponse])
def list_assessments(course_id: Optional[str] = None, db: Session = Depends(get_db)):
    """List assessments, optionally filtered by course."""
    query = db.query(Assessment)
    if course_id:
        query = query.filter(Assessment.course_id == course_id)
    return query.order_by(Assessment.created_at.desc()).all()

@router.get("/{assessment_id}", response_model=AssessmentResponse)
def get_assessment(assessment_id: str, db: Session = Depends(get_db)):
    """Retrieve full assessment with questions."""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found.")
    return assessment

@router.post("/{assessment_id}/publish", response_model=AssessmentResponse)
def publish_assessment(
    assessment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(faculty_only)
):
    """Release an assessment for students to attempt."""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found.")
    assessment.is_published = True
    db.commit()
    db.refresh(assessment)
    return assessment

@router.post("/{assessment_id}/questions", response_model=QuestionResponse)
def add_question(
    assessment_id: str,
    question_in: QuestionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(faculty_only)
):
    """Add a question to an assessment, mapped to a CLO and Bloom's level."""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found.")

    question = Question(
        assessment_id=assessment_id,
        course_id=assessment.course_id,
        clo_id=question_in.clo_id,
        blooms_level=question_in.blooms_level,
        question_type=question_in.question_type,
        difficulty=question_in.difficulty,
        prompt=question_in.prompt,
        marks=question_in.marks,
        explanation=question_in.explanation,
        is_ai_generated=False
    )
    db.add(question)
    db.flush()

    for opt in question_in.options:
        db_opt = QuestionOption(
            question_id=question.id,
            option_text=opt.option_text,
            is_correct=opt.is_correct,
            order_index=opt.order_index
        )
        db.add(db_opt)

    db.commit()
    db.refresh(question)
    return question

@router.post("/{assessment_id}/submit", response_model=SubmissionResponse)
def submit_assessment(
    assessment_id: str,
    submission_in: SubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Student submits assessment.
    Objective questions (MCQ / True-False) are automatically graded against verified answers.
    """
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found.")

    submission = Submission(
        assessment_id=assessment_id,
        student_id=current_user.id,
        status=SubmissionStatus.GRADED,
        submitted_at=datetime.now(timezone.utc)
    )
    db.add(submission)
    db.flush()

    total_score = 0.0
    max_score = 0.0
    answer_responses = []

    for item in submission_in.answers:
        q = db.query(Question).filter(Question.id == item.question_id).first()
        if not q:
            continue

        max_score += q.marks
        marks_awarded = 0.0
        is_evaluated = False
        notes = None

        if q.question_type in [QuestionType.MCQ, QuestionType.TRUE_FALSE]:
            is_evaluated = True
            if item.selected_option_id:
                opt = db.query(QuestionOption).filter(QuestionOption.id == item.selected_option_id).first()
                if opt and opt.is_correct:
                    marks_awarded = q.marks
                    notes = "Correct answer"
                else:
                    notes = "Incorrect choice"
            else:
                notes = "Unanswered"
        else:
            # Subjective question left for faculty review
            is_evaluated = False
            notes = "Pending faculty review"
            submission.status = SubmissionStatus.SUBMITTED

        total_score += marks_awarded

        ans = Answer(
            submission_id=submission.id,
            question_id=q.id,
            selected_option_id=item.selected_option_id,
            text_answer=item.text_answer,
            marks_awarded=marks_awarded,
            is_evaluated=is_evaluated,
            evaluation_notes=notes
        )
        db.add(ans)

    submission.total_score = total_score
    submission.max_score = max_score
    submission.percentage = round((total_score / max_score * 100), 2) if max_score > 0 else 0.0

    db.commit()
    db.refresh(submission)
    return submission

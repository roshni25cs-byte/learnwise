from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User, UserRole, FacultyApproval, ApprovalStatus
from app.schemas.user import UserResponse, FacultyApprovalDetail, ApprovalActionRequest
from app.api.deps import RoleChecker

router = APIRouter()
admin_only = RoleChecker([UserRole.ADMIN])

@router.get("/users", response_model=List[UserResponse])
def list_users(
    role: Optional[UserRole] = Query(None, description="Filter users by role"),
    db: Session = Depends(get_db),
    current_admin: User = Depends(admin_only)
):
    """Admin endpoint to retrieve all registered users with optional role filtering."""
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    return query.order_by(User.created_at.desc()).all()

@router.get("/faculty/pending", response_model=List[FacultyApprovalDetail])
def list_pending_faculty(
    db: Session = Depends(get_db),
    current_admin: User = Depends(admin_only)
):
    """Retrieve all faculty registrations that are currently pending administrative approval."""
    approvals = (
        db.query(FacultyApproval)
        .join(User, FacultyApproval.faculty_id == User.id)
        .filter(FacultyApproval.status == ApprovalStatus.PENDING)
        .order_by(FacultyApproval.created_at.asc())
        .all()
    )

    result = []
    for app in approvals:
        result.append(FacultyApprovalDetail(
            id=app.id,
            faculty_id=app.faculty.id,
            faculty_name=app.faculty.full_name,
            faculty_email=app.faculty.email,
            status=app.status,
            remarks=app.remarks,
            reviewed_by=app.reviewed_by,
            reviewer_name=app.reviewer.full_name if app.reviewer else None,
            created_at=app.created_at,
            reviewed_at=app.reviewed_at
        ))
    return result

@router.post("/faculty/{faculty_id}/approve", response_model=FacultyApprovalDetail)
def approve_faculty(
    faculty_id: str,
    action: Optional[ApprovalActionRequest] = None,
    db: Session = Depends(get_db),
    current_admin: User = Depends(admin_only)
):
    """Approve a faculty registration, granting dashboard and course creation privileges."""
    faculty_user = db.query(User).filter(User.id == faculty_id, User.role == UserRole.FACULTY).first()
    if not faculty_user:
        raise HTTPException(status_code=404, detail="Faculty account not found.")

    approval = (
        db.query(FacultyApproval)
        .filter(FacultyApproval.faculty_id == faculty_id)
        .order_by(FacultyApproval.created_at.desc())
        .first()
    )
    if not approval:
        approval = FacultyApproval(faculty_id=faculty_id)
        db.add(approval)

    approval.status = ApprovalStatus.APPROVED
    approval.remarks = action.remarks if action and action.remarks else "Approved by administrator"
    approval.reviewed_by = current_admin.id
    approval.reviewed_at = datetime.now(timezone.utc)

    faculty_user.is_approved = True
    db.commit()
    db.refresh(approval)

    return FacultyApprovalDetail(
        id=approval.id,
        faculty_id=faculty_user.id,
        faculty_name=faculty_user.full_name,
        faculty_email=faculty_user.email,
        status=approval.status,
        remarks=approval.remarks,
        reviewed_by=approval.reviewed_by,
        reviewer_name=current_admin.full_name,
        created_at=approval.created_at,
        reviewed_at=approval.reviewed_at
    )

@router.post("/faculty/{faculty_id}/reject", response_model=FacultyApprovalDetail)
def reject_faculty(
    faculty_id: str,
    action: ApprovalActionRequest,
    db: Session = Depends(get_db),
    current_admin: User = Depends(admin_only)
):
    """Reject a faculty registration with required administrative remarks."""
    faculty_user = db.query(User).filter(User.id == faculty_id, User.role == UserRole.FACULTY).first()
    if not faculty_user:
        raise HTTPException(status_code=404, detail="Faculty account not found.")

    approval = (
        db.query(FacultyApproval)
        .filter(FacultyApproval.faculty_id == faculty_id)
        .order_by(FacultyApproval.created_at.desc())
        .first()
    )
    if not approval:
        approval = FacultyApproval(faculty_id=faculty_id)
        db.add(approval)

    approval.status = ApprovalStatus.REJECTED
    approval.remarks = action.remarks or "Application rejected by administrator."
    approval.reviewed_by = current_admin.id
    approval.reviewed_at = datetime.now(timezone.utc)

    faculty_user.is_approved = False
    db.commit()
    db.refresh(approval)

    return FacultyApprovalDetail(
        id=approval.id,
        faculty_id=faculty_user.id,
        faculty_name=faculty_user.full_name,
        faculty_email=faculty_user.email,
        status=approval.status,
        remarks=approval.remarks,
        reviewed_by=approval.reviewed_by,
        reviewer_name=current_admin.full_name,
        created_at=approval.created_at,
        reviewed_at=approval.reviewed_at
    )

@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(admin_only)
):
    """Return platform overview statistics."""
    total_users = db.query(User).count()
    total_students = db.query(User).filter(User.role == UserRole.STUDENT).count()
    total_faculty = db.query(User).filter(User.role == UserRole.FACULTY).count()
    pending_approvals = (
        db.query(FacultyApproval)
        .filter(FacultyApproval.status == ApprovalStatus.PENDING)
        .count()
    )
    approved_faculty = (
        db.query(User)
        .filter(User.role == UserRole.FACULTY, User.is_approved == True)
        .count()
    )

    return {
        "total_users": total_users,
        "total_students": total_students,
        "total_faculty": total_faculty,
        "approved_faculty": approved_faculty,
        "pending_faculty_approvals": pending_approvals,
    }

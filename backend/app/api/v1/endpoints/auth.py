from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User, UserRole, FacultyApproval, ApprovalStatus
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import LoginRequest, Token, RegisterResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user (Student or Faculty).
    - Students are immediately active and approved.
    - Faculty accounts require administrator review and approval before they can log in.
    """
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    if user_in.role == UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator accounts cannot be registered publicly."
        )

    # Determine approval status based on role
    requires_approval = (user_in.role == UserRole.FACULTY)
    is_approved = not requires_approval

    new_user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        role=user_in.role,
        hashed_password=get_password_hash(user_in.password),
        is_active=True,
        is_approved=is_approved
    )
    db.add(new_user)
    db.flush()

    # If faculty, create pending approval request record
    if requires_approval:
        approval_record = FacultyApproval(
            faculty_id=new_user.id,
            status=ApprovalStatus.PENDING
        )
        db.add(approval_record)

    db.commit()
    db.refresh(new_user)

    msg = (
        "Registration successful. Your faculty account is pending administrator approval before you can sign in."
        if requires_approval
        else "Registration successful. You can now log in to your account."
    )

    return RegisterResponse(
        message=msg,
        requires_approval=requires_approval,
        user=new_user
    )

@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate user with email and password, returning a JWT bearer token.
    Faculty accounts that are pending approval or rejected will receive a 403 Forbidden.
    """
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is currently inactive. Contact support."
        )

    # Faculty approval verification
    if user.role == UserRole.FACULTY and not user.is_approved:
        # Check approval status
        approval = (
            db.query(FacultyApproval)
            .filter(FacultyApproval.faculty_id == user.id)
            .order_by(FacultyApproval.created_at.desc())
            .first()
        )
        status_text = approval.status.value if approval else "PENDING"
        if status_text == "REJECTED":
            remarks = f" Reason: {approval.remarks}" if approval and approval.remarks else ""
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Your faculty account registration was rejected by an administrator.{remarks}"
            )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your faculty registration is currently pending administrator approval. Please wait for an admin to approve your account."
        )

    access_token = create_access_token(subject=user.id)
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Return profile for the currently authenticated user."""
    return current_user

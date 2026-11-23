from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import get_password_hash
from app.models.user import User, UserRole

def seed_initial_data(db: Session) -> None:
    """
    Ensure the super administrator account exists on system startup.
    Creates default initial administrator if not present.
    """
    admin_user = db.query(User).filter(User.email == settings.FIRST_SUPERUSER_EMAIL).first()
    if not admin_user:
        admin_user = User(
            email=settings.FIRST_SUPERUSER_EMAIL,
            full_name="System Administrator",
            hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
            role=UserRole.ADMIN,
            is_active=True,
            is_approved=True,
        )
        db.add(admin_user)
        db.commit()
        print(f"[LearnWise Seed] Initial Super Admin created: {settings.FIRST_SUPERUSER_EMAIL}")
    else:
        print(f"[LearnWise Seed] Super Admin verified: {settings.FIRST_SUPERUSER_EMAIL}")

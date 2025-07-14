from sqlalchemy.orm import Session
from app import models
from passlib.context import CryptContext
from app.config import ADMIN_USERNAME, ADMIN_PASSWORD

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_admin(db: Session):
    return db.query(models.User).filter(models.User.username == ADMIN_USERNAME).first()

def create_admin_if_not_exists(db: Session):
    admin = get_admin(db)
    if not admin:
        hashed = get_password_hash(ADMIN_PASSWORD)
        admin = models.User(username=ADMIN_USERNAME, hashed_password=hashed, role="admin")
        db.add(admin)
        db.commit()
        db.refresh(admin)
    return admin 
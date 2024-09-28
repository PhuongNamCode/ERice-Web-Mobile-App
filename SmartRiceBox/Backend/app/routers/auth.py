from fastapi import APIRouter, status, Depends, HTTPException
from .. import schemas, utils, models, oauth2
from sqlalchemy.orm import Session
from ..database import get_db

router = APIRouter(
    prefix="/api/auth",
    tags = ["Auth"]
)

@router.post("/signup", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut)
def create_user(user:schemas.UserCreate, db: Session = Depends(get_db)):
    # Check role is valid
    role_id = db.query(models.Role).filter(models.Role.name==user.role).first().id
    if not role_id:
        raise HTTPException(status_code=404, detail="Role not found")
    exist_user = db.query(models.User).filter(models.User.username==user.username).first()
    if exist_user:
        raise HTTPException(status_code=409, detail="User is existed")
    #hash the password
    hashed_password = utils.hash(user.password)
    user.password = hashed_password
     
    new_user = models.User(
        username = user.username,
        phone_num = user.phone_num,
        email = user.email,
        password = user.password,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    new_user_role = models.UserRole(
        user_id = new_user.id,
        role_id = role_id
    )
    db.add(new_user_role)
    db.commit()
    return new_user

@router.post("/login", response_model=schemas.Token, status_code=status.HTTP_200_OK)
def login(user_cred:schemas.UserLogin,db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == user_cred.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incorrect username or password")
    if not utils.verify(user_cred.password, user.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incorrect username or password")
    access_token = oauth2.create_access_token(data={"user_id": user.id})
    return {"access_token": access_token, "token_type": "bearer"}
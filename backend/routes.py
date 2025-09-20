import uuid
import datetime

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Column, String
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from database import Base, get_db


"""Models"""


class MessageBase(BaseModel):
    title: str = Field(min_length=1, max_length=40)
    content: str = Field(min_length=0, max_length=500)


class Messages(Base):
    __tablename__ = "messages"
    id = Column(String, primary_key=True, index=True)

    title = Column(String)
    content = Column(String)
    created_at = Column(String)
    modified_at = Column(String)


"""API Routes"""


db_dependency = Annotated[Session, Depends(get_db)]


router = APIRouter(prefix="/api", tags=["message"])


@router.get("/messages/get_all_messages")
async def get_all_messages(db : db_dependency):
    return {"data" : db.query(Messages).all()}


@router.get("/messages/get_message_by_id/{id}")
async def get_message_by_id(db: db_dependency, id: str):
    db_message = db.query(Messages).filter(Messages.id == id).first()
    if not db_message:
        raise HTTPException(status_code=404, detail="Message Not Found")
    return {"data" : db_message}


@router.post("/messages/create_message")
async def create_message(db: db_dependency, message: MessageBase):
    db_message = Messages(
        id = str(uuid.uuid4()),
        title = message.title,
        content = message.content,
        created_at = datetime.date.today(),
        modified_at = datetime.date.today()
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return {"data" : "Message Created Successfully"}


@router.put("/messages/update_message/{id}")
async def update_message(db: db_dependency, message: MessageBase, id: str):
    db_message = db.query(Messages).filter(Messages.id == id).first()
    if not db_message:
        raise HTTPException(status_code=404, detail="Message Not Found")
    
    db_message.title = message.title
    db_message.content = message.content
    db_message.modified_at = datetime.date.today()

    db.commit()
    db.refresh(db_message)
    return {"data" : "Message Updated Successfully"}


@router.delete("/messages/delete_message/{id}")
async def delete_message(db: db_dependency, id: str):
    db_message = db.query(Messages).filter(Messages.id == id).first()
    if not db_message:
        raise HTTPException(status_code=404, detail="Message Not Found")
    
    db.delete(db_message)
    db.commit()
    return {"data" : "Message Deleted Successfully"}


@router.delete("/messages/delete_all_messages")
async def delete_all_messages(db: db_dependency):
    db_messages = db.query(Messages).all()
    if not db_messages:
        raise HTTPException(status_code=404, detail="Messages Not Found")
    
    for message in db_messages:
        db.delete(message)
    
    db.commit()
    return {"data" : "All Messages Have Been Deleted"}
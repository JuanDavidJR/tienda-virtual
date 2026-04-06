from pydantic import BaseModel
from app.models.ticket import TicketStatus, TicketCategory

class TicketCreate(BaseModel):
    subject: str
    description: str
    category: TicketCategory

class TicketResponseCreate(BaseModel):
    message: str

class TicketStatusUpdate(BaseModel):
    status: TicketStatus

class TicketResponseOut(BaseModel):
    id: int
    user_id: int
    message: str

    class Config:
        from_attributes = True

class TicketOut(BaseModel):
    id: int
    subject: str
    description: str
    category: TicketCategory
    status: TicketStatus
    user_id: int
    responses: list[TicketResponseOut] = []

    class Config:
        from_attributes = True
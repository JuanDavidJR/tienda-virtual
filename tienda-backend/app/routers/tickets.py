from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.user import User
from app.schemas.ticket import TicketCreate, TicketResponseCreate, TicketStatusUpdate, TicketOut
from app.services.ticket_service import TicketService

router = APIRouter(prefix="/tickets", tags=["Soporte"])

@router.post("/", response_model=TicketOut, status_code=201)
async def create_ticket(
    data: TicketCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await TicketService(db, current_user.id).create_ticket(data)

@router.get("/me", response_model=list[TicketOut])
async def my_tickets(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await TicketService(db, current_user.id).get_my_tickets()

@router.get("/all", response_model=list[TicketOut])
async def all_tickets(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await TicketService(db, current_user.id, current_user.is_admin).get_all_tickets()

@router.post("/{ticket_id}/reply", response_model=TicketOut)
async def reply_ticket(
    ticket_id: int,
    data: TicketResponseCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await TicketService(db, current_user.id, current_user.is_admin).reply_ticket(ticket_id, data)

@router.patch("/{ticket_id}/status", response_model=TicketOut)
async def update_status(
    ticket_id: int,
    data: TicketStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await TicketService(db, current_user.id, current_user.is_admin).update_status(ticket_id, data)
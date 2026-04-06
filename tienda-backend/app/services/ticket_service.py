from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException
from app.models.ticket import Ticket, TicketResponse, TicketStatus
from app.schemas.ticket import TicketCreate, TicketResponseCreate, TicketStatusUpdate

class TicketService:
    def __init__(self, db: AsyncSession, user_id: int, is_admin: bool = False):
        self.db = db
        self.user_id = user_id
        self.is_admin = is_admin

    async def _get_ticket(self, ticket_id: int) -> Ticket:
        result = await self.db.execute(
            select(Ticket)
            .options(selectinload(Ticket.responses))
            .where(Ticket.id == ticket_id)
        )
        ticket = result.scalar_one_or_none()
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket no encontrado")
        return ticket

    async def create_ticket(self, data: TicketCreate) -> Ticket:
        ticket = Ticket(
            user_id=self.user_id,
            subject=data.subject,
            description=data.description,
            category=data.category
        )
        self.db.add(ticket)
        await self.db.commit()

        result = await self.db.execute(
            select(Ticket)
            .options(selectinload(Ticket.responses))
            .where(Ticket.id == ticket.id)
        )
        return result.scalar_one()

    async def get_my_tickets(self) -> list[Ticket]:
        """Usuario ve solo sus tickets."""
        result = await self.db.execute(
            select(Ticket)
            .options(selectinload(Ticket.responses))
            .where(Ticket.user_id == self.user_id)
        )
        return result.scalars().all()

    async def get_all_tickets(self) -> list[Ticket]:
        """Solo admin ve todos los tickets."""
        if not self.is_admin:
            raise HTTPException(status_code=403, detail="Sin permisos")
        result = await self.db.execute(
            select(Ticket).options(selectinload(Ticket.responses))
        )
        return result.scalars().all()

    async def reply_ticket(self, ticket_id: int, data: TicketResponseCreate) -> Ticket:
        ticket = await self._get_ticket(ticket_id)

        # Usuario solo puede responder sus propios tickets
        if not self.is_admin and ticket.user_id != self.user_id:
            raise HTTPException(status_code=403, detail="Sin permisos")

        response = TicketResponse(
            ticket_id=ticket_id,
            user_id=self.user_id,
            message=data.message
        )
        self.db.add(response)

        # Si el admin responde, cambia el estado automáticamente
        if self.is_admin and ticket.status == TicketStatus.abierto:
            ticket.status = TicketStatus.en_proceso

        await self.db.commit()
        return await self._get_ticket(ticket_id)

    async def update_status(self, ticket_id: int, data: TicketStatusUpdate) -> Ticket:
        """Solo admin puede cambiar el estado."""
        if not self.is_admin:
            raise HTTPException(status_code=403, detail="Sin permisos")

        ticket = await self._get_ticket(ticket_id)
        ticket.status = data.status
        await self.db.commit()
        return await self._get_ticket(ticket_id)
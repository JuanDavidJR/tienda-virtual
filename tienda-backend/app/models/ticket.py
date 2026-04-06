from sqlalchemy import String, Text, ForeignKey, Enum, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
import enum

class TicketStatus(str, enum.Enum):
    abierto = "abierto"
    en_proceso = "en_proceso"
    resuelto = "resuelto"
    cerrado = "cerrado"

class TicketCategory(str, enum.Enum):
    queja = "queja"
    consulta = "consulta"
    devolucion = "devolucion"
    otro = "otro"

class Ticket(Base):
    __tablename__ = "tickets"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    subject: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    category: Mapped[TicketCategory] = mapped_column(Enum(TicketCategory))
    status: Mapped[TicketStatus] = mapped_column(
        Enum(TicketStatus), default=TicketStatus.abierto
    )
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())

    user: Mapped["User"] = relationship("User")
    responses: Mapped[list["TicketResponse"]] = relationship(back_populates="ticket")

class TicketResponse(Base):
    __tablename__ = "ticket_responses"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    ticket_id: Mapped[int] = mapped_column(ForeignKey("tickets.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    message: Mapped[str] = mapped_column(Text)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())

    ticket: Mapped["Ticket"] = relationship(back_populates="responses")
    user: Mapped["User"] = relationship("User")
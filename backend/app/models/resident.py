from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Resident(Base):
    __tablename__ = "residents"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    created_by: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    gender: Mapped[str] = mapped_column(String(20), nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    height: Mapped[float] = mapped_column(Float, nullable=False)
    weight: Mapped[float] = mapped_column(Float, nullable=False)
    bmi: Mapped[float] = mapped_column(Float, nullable=False)
    family_history_with_overweight: Mapped[str] = mapped_column(String(10), nullable=False)
    favc: Mapped[str] = mapped_column(String(10), nullable=False)
    fcvc: Mapped[float] = mapped_column(Float, nullable=False)
    ncp: Mapped[float] = mapped_column(Float, nullable=False)
    caec: Mapped[str] = mapped_column(String(30), nullable=False)
    smoke: Mapped[str] = mapped_column(String(10), nullable=False)
    ch2o: Mapped[float] = mapped_column(Float, nullable=False)
    scc: Mapped[str] = mapped_column(String(10), nullable=False)
    faf: Mapped[float] = mapped_column(Float, nullable=False)
    tue: Mapped[float] = mapped_column(Float, nullable=False)
    calc: Mapped[str] = mapped_column(String(30), nullable=False)
    mtrans: Mapped[str] = mapped_column(String(50), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    creator = relationship("User", back_populates="residents")
    classification_results = relationship(
        "ClassificationResult",
        back_populates="resident",
        cascade="all, delete-orphan",
    )

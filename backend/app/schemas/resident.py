from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import (
    FrequencyValue,
    GenderValue,
    TransportValue,
    YesNoValue,
    age_field,
    height_field,
    lifestyle_field,
    weight_field,
)


class ResidentBase(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    gender: GenderValue
    age: int = age_field
    height: float = height_field
    weight: float = weight_field
    family_history_with_overweight: YesNoValue
    favc: YesNoValue
    fcvc: float = lifestyle_field
    ncp: float = lifestyle_field
    caec: FrequencyValue
    smoke: YesNoValue
    ch2o: float = lifestyle_field
    scc: YesNoValue
    faf: float = lifestyle_field
    tue: float = lifestyle_field
    calc: FrequencyValue
    mtrans: TransportValue


class ResidentCreate(ResidentBase):
    model_config = ConfigDict(extra="forbid")

    created_by: int | None = None


class ResidentUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    created_by: int | None = None
    name: str | None = Field(default=None, min_length=1, max_length=150)
    gender: GenderValue | None = None
    age: int | None = Field(default=None, gt=0, description="Age must be greater than 0")
    height: float | None = Field(
        default=None,
        gt=0,
        description="Height is measured in meters and must be greater than 0",
    )
    weight: float | None = Field(
        default=None,
        gt=0,
        description="Weight is measured in kilograms and must be greater than 0",
    )
    family_history_with_overweight: YesNoValue | None = None
    favc: YesNoValue | None = None
    fcvc: float | None = None
    ncp: float | None = None
    caec: FrequencyValue | None = None
    smoke: YesNoValue | None = None
    ch2o: float | None = None
    scc: YesNoValue | None = None
    faf: float | None = None
    tue: float | None = None
    calc: FrequencyValue | None = None
    mtrans: TransportValue | None = None


class ResidentResponse(ResidentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_by: int | None
    bmi: float
    created_at: datetime
    updated_at: datetime

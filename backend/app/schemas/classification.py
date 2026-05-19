from pydantic import BaseModel, ConfigDict

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


class PredictionInput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    Gender: GenderValue
    Age: int = age_field
    Height: float = height_field
    Weight: float = weight_field
    family_history_with_overweight: YesNoValue
    FAVC: YesNoValue
    FCVC: float = lifestyle_field
    NCP: float = lifestyle_field
    CAEC: FrequencyValue
    SMOKE: YesNoValue
    CH2O: float = lifestyle_field
    SCC: YesNoValue
    FAF: float = lifestyle_field
    TUE: float = lifestyle_field
    CALC: FrequencyValue
    MTRANS: TransportValue

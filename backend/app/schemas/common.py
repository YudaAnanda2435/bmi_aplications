from typing import Literal

from pydantic import Field


GenderValue = Literal["Male", "Female"]
YesNoValue = Literal["yes", "no"]
FrequencyValue = Literal["no", "Sometimes", "Frequently", "Always"]
TransportValue = Literal[
    "Automobile",
    "Motorbike",
    "Bike",
    "Public_Transportation",
    "Walking",
]

GENDER_VALUES = ["Male", "Female"]
YES_NO_VALUES = ["yes", "no"]
FREQUENCY_VALUES = ["no", "Sometimes", "Frequently", "Always"]
TRANSPORT_VALUES = [
    "Automobile",
    "Motorbike",
    "Bike",
    "Public_Transportation",
    "Walking",
]

age_field = Field(gt=0, description="Age must be greater than 0")
height_field = Field(
    gt=0,
    description=(
        "Height may be entered in meters (1.6) or centimeters (160). "
        "The backend stores and processes it in meters."
    ),
)
weight_field = Field(gt=0, description="Weight is measured in kilograms and must be greater than 0")
lifestyle_field = Field(description="Numeric lifestyle value used by the final model pipeline")

import json
from functools import lru_cache
from pathlib import Path
from typing import Any

import joblib
import pandas as pd

from app.core.config import get_settings
from app.services.recommendation_service import get_recommendation_plan
from app.utils.measurement import calculate_bmi, get_bmi_category, normalize_height_to_meter


DEFAULT_FEATURE_NAMES = [
    "Gender",
    "Age",
    "Height",
    "Weight",
    "BMI_Category",
]
OUTPUT_CLASSES = ["Underweight", "Normal", "Overweight", "Obesity"]


class MLService:
    def __init__(self) -> None:
        settings = get_settings()
        self.project_root = Path(__file__).resolve().parents[2]
        self.model_path = self._resolve_project_path(settings.model_path)
        self.metadata_path = self._resolve_project_path(settings.model_metadata_path)
        self.model: Any | None = None
        self.metadata: dict[str, Any] = {}

    def _resolve_project_path(self, path_value: str) -> Path:
        path = Path(path_value)
        if path.is_absolute():
            return path
        return self.project_root / path

    def load_model(self) -> Any:
        if self.model is not None:
            return self.model

        if not self.model_path.exists():
            raise FileNotFoundError(f"Model file not found: {self.model_path}")

        self.model = joblib.load(self.model_path)
        return self.model

    def load_metadata(self) -> dict[str, Any]:
        if self.metadata:
            return self.metadata

        if not self.metadata_path.exists():
            raise FileNotFoundError(f"Model metadata not found: {self.metadata_path}")

        with self.metadata_path.open("r", encoding="utf-8") as metadata_file:
            self.metadata = json.load(metadata_file)
        return self.metadata

    def get_model_info(self) -> dict[str, Any]:
        metadata = self.load_metadata()
        class_labels = metadata.get("class_labels") or metadata.get("target_classes") or OUTPUT_CLASSES
        model_loaded = False
        model_error = None

        try:
            self.load_model()
            model_loaded = True
        except Exception as exc:
            model_error = str(exc)

        return {
            "model_name": metadata.get("model_name"),
            "version": metadata.get("version"),
            "model_version": self._get_model_version(metadata),
            "algorithm": "Categorical Naive Bayes",
            "model_file": self.model_path.name,
            "metadata_file": self.metadata_path.name,
            "model_loaded": model_loaded,
            "model_error": model_error,
            "input_features": metadata.get("input_features", DEFAULT_FEATURE_NAMES),
            "class_labels": class_labels,
            "numeric_features": metadata.get("numeric_features"),
            "categorical_features": metadata.get("categorical_features"),
            "additional_feature": metadata.get("additional_feature"),
            "additional_features": metadata.get("additional_features"),
            "bmi_formula": metadata.get("bmi_formula", "BMI = Weight / Height^2"),
            "bmi_category_rules": metadata.get("bmi_category_rules"),
        }

    def predict(self, input_data: dict[str, Any]) -> dict[str, Any]:
        model = self.load_model()
        metadata = self.load_metadata()
        height_in_meter = normalize_height_to_meter(float(input_data["Height"]))
        weight = float(input_data["Weight"])
        bmi = self.calculate_bmi(
            height=height_in_meter,
            weight=weight,
        )
        rounded_bmi = round(bmi, 2)
        bmi_category = get_bmi_category(rounded_bmi)

        features = metadata.get("input_features", DEFAULT_FEATURE_NAMES)
        model_input = {
            **input_data,
            "Height": height_in_meter,
            "Weight": weight,
            "BMI": rounded_bmi,
            "BMI_Category": bmi_category,
        }
        self._validate_model_input(model_input, features)
        dataframe = pd.DataFrame([[model_input[name] for name in features]], columns=features)

        predicted_class = str(model.predict(dataframe)[0])
        probabilities = self._get_probabilities(model, dataframe)
        recommendation_plan = get_recommendation_plan(
            predicted_class=predicted_class,
            bmi=bmi,
            input_data=model_input,
        )

        return {
            "predicted_class": predicted_class,
            "bmi": rounded_bmi,
            "bmi_category": bmi_category,
            "model_version": self._get_model_version(metadata),
            "probabilities": probabilities,
            "recommendation": recommendation_plan["recommendation"],
            "early_warning": recommendation_plan["early_warning"],
            "goal": recommendation_plan["goal"],
            "note": "Informasi awal dan alat bantu, tidak menggantikan saran tenaga kesehatan.",
            "diet_pattern": recommendation_plan["diet_pattern"],
            "recommendation_summary": recommendation_plan["recommendation_summary"],
            "main_recommendations": recommendation_plan["main_recommendations"],
            "meal_schedule": recommendation_plan["meal_schedule"],
            "additional_notes": recommendation_plan["additional_notes"],
            "method": recommendation_plan["method"],
            "source_basis": recommendation_plan["source_basis"],
            "source_references": recommendation_plan["source_references"],
        }

    def _get_probabilities(self, model: Any, dataframe: pd.DataFrame) -> dict[str, float | None]:
        probability_result = {label: None for label in OUTPUT_CLASSES}

        if not hasattr(model, "predict_proba"):
            return probability_result

        predicted_probabilities = model.predict_proba(dataframe)[0]
        model_classes = [str(label) for label in getattr(model, "classes_", OUTPUT_CLASSES)]

        for class_label, probability in zip(model_classes, predicted_probabilities):
            if class_label in probability_result:
                probability_result[class_label] = round(float(probability), 4)

        return probability_result

    @staticmethod
    def calculate_bmi(height: float, weight: float) -> float:
        return calculate_bmi(height=height, weight=weight)

    def _get_model_version(self, metadata: dict[str, Any]) -> str | None:
        version = metadata.get("version")
        if version:
            return str(version)

        stem = self.model_path.stem.lower()
        if "v6" in stem:
            return "V6"
        if "final" in stem:
            return "FINAL_NB_ANTHROPOMETRIC"
        return "FINAL_NB_ANTHROPOMETRIC"

    @staticmethod
    def _validate_model_input(model_input: dict[str, Any], features: list[str]) -> None:
        missing_features = [feature for feature in features if feature not in model_input]
        if missing_features:
            raise ValueError(f"Missing model features: {', '.join(missing_features)}")

        invalid_features: list[str] = []
        for feature in features:
            value = model_input[feature]
            if value is None:
                invalid_features.append(feature)
                continue
            if isinstance(value, str) and value.strip() in {"", "-"}:
                invalid_features.append(feature)
                continue
            if not isinstance(value, str) and pd.isna(value):
                invalid_features.append(feature)

        if invalid_features:
            raise ValueError(f"Invalid model feature values: {', '.join(invalid_features)}")


@lru_cache
def get_ml_service() -> MLService:
    return MLService()

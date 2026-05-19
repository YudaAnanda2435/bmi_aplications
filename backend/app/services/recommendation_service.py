from __future__ import annotations

from typing import Any


METHOD_NAME = "Rule-Based Recommendation / Forward Chaining"

SOURCE_BASIS = {
    "kemenkes_isi_piringku": {
        "name": "Kemenkes - Isi Piringku / Pedoman Gizi Seimbang",
        "url": "https://ayosehat.kemkes.go.id/isi-piringku-pedoman-makan-kekinian-orang-indonesia",
        "used_for": [
            "makanan pokok, lauk, sayur, dan buah",
            "minum air yang cukup",
            "aktivitas fisik",
            "membatasi makanan manis, asin, dan berlemak",
            "menjaga berat badan",
        ],
    },
    "who_healthy_diet": {
        "name": "WHO - Healthy Diet",
        "url": "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
        "used_for": [
            "konsumsi sayur dan buah",
            "pola makan beragam",
            "membatasi gula, garam, dan lemak tidak sehat",
            "mengurangi makanan tinggi energi yang tidak seimbang",
        ],
    },
    "nhs_healthy_weight_gain": {
        "name": "NHS - Healthy Ways to Gain Weight",
        "url": "https://www.nhs.uk/live-well/healthy-weight/managing-your-weight/healthy-ways-to-gain-weight/",
        "used_for": [
            "kenaikan berat badan secara sehat",
            "makan bergizi seimbang",
            "tidak mengandalkan makanan tinggi gula untuk menaikkan berat badan",
        ],
    },
    "aha_acc_tos_obesity_guideline": {
        "name": "AHA/ACC/TOS Guideline - Management of Overweight and Obesity",
        "url": "https://www.acc.org/latest-in-cardiology/journal-scans/2014/07/10/16/17/2013-aha-acc-tos-guideline-for-the-management-of-overweight",
        "used_for": [
            "kontrol asupan energi",
            "kontrol porsi",
            "pendekatan rendah kalori terkontrol untuk overweight dan obesity",
        ],
    },
}


DIET_RULES: dict[str, dict[str, Any]] = {
    "Underweight": {
        "diet_pattern": "Pola Diet Peningkatan Asupan Gizi Seimbang",
        "early_warning": "Perlu Perhatian",
        "goal": "Membantu meningkatkan keteraturan makan dan asupan gizi seimbang.",
        "source_basis": [
            "Kemenkes - Isi Piringku / Pedoman Gizi Seimbang",
            "NHS - Healthy Ways to Gain Weight",
        ],
        "main_recommendations": [
            "Makan utama secara teratur.",
            "Tingkatkan asupan makanan bergizi seimbang.",
            "Perhatikan kecukupan makanan pokok, lauk sumber protein, sayur, dan buah.",
            "Tambahkan makanan selingan bergizi dalam porsi wajar bila diperlukan.",
            "Pantau berat badan secara berkala.",
        ],
        "meal_schedule": [
            {
                "time": "Pagi",
                "recommendation": "Makanan pokok, lauk sumber protein, sayur, dan buah.",
            },
            {
                "time": "Selingan pagi",
                "recommendation": "Buah atau makanan selingan bergizi dalam porsi wajar.",
            },
            {
                "time": "Siang",
                "recommendation": "Makanan utama dengan komposisi makanan pokok, lauk, sayur, dan buah.",
            },
            {
                "time": "Selingan sore",
                "recommendation": "Camilan bergizi dalam porsi wajar, bukan makanan tinggi gula berlebihan.",
            },
            {
                "time": "Malam",
                "recommendation": "Makanan utama dengan komposisi seimbang dan tetap memperhatikan keteraturan makan.",
            },
        ],
    },
    "Normal": {
        "diet_pattern": "Pola Diet Pemeliharaan Gizi Seimbang",
        "early_warning": "Aman",
        "goal": "Mempertahankan pola makan seimbang, aktivitas fisik, dan berat badan yang stabil.",
        "source_basis": [
            "Kemenkes - Isi Piringku / Pedoman Gizi Seimbang",
            "WHO - Healthy Diet",
        ],
        "main_recommendations": [
            "Pertahankan pola makan seimbang.",
            "Konsumsi sayur dan buah secara teratur.",
            "Batasi konsumsi makanan tinggi kalori agar status gizi tetap terjaga.",
            "Lakukan aktivitas fisik secara rutin.",
            "Pantau berat badan secara berkala.",
        ],
        "meal_schedule": [
            {
                "time": "Pagi",
                "recommendation": "Makanan pokok, lauk, dan buah.",
            },
            {
                "time": "Selingan pagi",
                "recommendation": "Buah atau camilan sehat bila diperlukan.",
            },
            {
                "time": "Siang",
                "recommendation": "Makanan pokok, lauk, sayur, dan buah.",
            },
            {
                "time": "Selingan sore",
                "recommendation": "Buah atau camilan sehat dalam porsi wajar bila diperlukan.",
            },
            {
                "time": "Malam",
                "recommendation": "Makanan seimbang dengan porsi tidak berlebihan.",
            },
        ],
    },
    "Overweight": {
        "diet_pattern": "Pola Diet Kontrol Berat Badan",
        "early_warning": "Perlu Perhatian",
        "goal": "Mengontrol porsi, membatasi makanan tinggi kalori, dan meningkatkan aktivitas fisik.",
        "source_basis": [
            "Kemenkes - Isi Piringku / Pedoman Gizi Seimbang",
            "WHO - Healthy Diet",
            "AHA/ACC/TOS Guideline - Management of Overweight and Obesity",
        ],
        "main_recommendations": [
            "Kontrol porsi makanan.",
            "Batasi makanan tinggi kalori atau fast food.",
            "Kurangi makanan manis, asin, dan berlemak.",
            "Tingkatkan konsumsi sayur dan buah.",
            "Tingkatkan aktivitas fisik secara bertahap.",
        ],
        "meal_schedule": [
            {
                "time": "Pagi",
                "recommendation": "Makanan pokok secukupnya, lauk, sayur, dan buah.",
            },
            {
                "time": "Selingan pagi",
                "recommendation": "Buah atau pilihan camilan rendah gula dan rendah lemak bila diperlukan.",
            },
            {
                "time": "Siang",
                "recommendation": "Perbanyak sayur, lauk cukup, dan makanan pokok secukupnya.",
            },
            {
                "time": "Selingan sore",
                "recommendation": "Buah atau camilan sehat dalam porsi wajar, hindari camilan tinggi kalori.",
            },
            {
                "time": "Malam",
                "recommendation": "Porsi lebih terkontrol dan hindari camilan berlebihan setelah makan malam.",
            },
        ],
    },
    "Obesity": {
        "diet_pattern": "Pola Diet Rendah Kalori Terkontrol",
        "early_warning": "Risiko Tinggi",
        "goal": "Mengontrol porsi lebih ketat, membatasi makanan tinggi kalori, dan mendorong pemantauan berkala.",
        "source_basis": [
            "Kemenkes - Isi Piringku / Pedoman Gizi Seimbang",
            "WHO - Healthy Diet",
            "AHA/ACC/TOS Guideline - Management of Overweight and Obesity",
        ],
        "main_recommendations": [
            "Kontrol porsi makan lebih ketat.",
            "Batasi makanan tinggi kalori, tinggi gula, dan tinggi lemak.",
            "Perbanyak sayur dan makanan bergizi seimbang.",
            "Kurangi fast food.",
            "Tingkatkan aktivitas fisik secara bertahap sesuai kemampuan.",
            "Lakukan pemantauan kondisi secara berkala.",
        ],
        "meal_schedule": [
            {
                "time": "Pagi",
                "recommendation": "Makanan seimbang dengan porsi terkontrol.",
            },
            {
                "time": "Selingan pagi",
                "recommendation": "Buah atau camilan sehat dalam porsi kecil bila diperlukan.",
            },
            {
                "time": "Siang",
                "recommendation": "Perbanyak sayur, lauk cukup, dan batasi makanan tinggi kalori.",
            },
            {
                "time": "Selingan sore",
                "recommendation": "Pilih camilan sehat dalam porsi kecil, hindari makanan tinggi gula dan lemak.",
            },
            {
                "time": "Malam",
                "recommendation": "Porsi ringan dan terkontrol, hindari makanan tinggi gula, lemak, dan fast food.",
            },
        ],
    },
}


CLASS_ALIASES = {
    "Insufficient_Weight": "Underweight",
    "Underweight": "Underweight",
    "Normal_Weight": "Normal",
    "Normal": "Normal",
    "Overweight_Level_I": "Overweight",
    "Overweight_Level_II": "Overweight",
    "Overweight": "Overweight",
    "Obesity_Type_I": "Obesity",
    "Obesity_Type_II": "Obesity",
    "Obesity_Type_III": "Obesity",
    "Obesity": "Obesity",
}


def normalize_class_name(predicted_class: str) -> str:
    if not predicted_class:
        return "Normal"

    value = str(predicted_class).strip()
    return CLASS_ALIASES.get(value, value)


def _get_value(data: dict[str, Any] | None, *keys: str) -> Any:
    if not data:
        return None

    for key in keys:
        if key in data:
            return data.get(key)

    lower_map = {str(key).lower(): value for key, value in data.items()}
    for key in keys:
        lowered = key.lower()
        if lowered in lower_map:
            return lower_map.get(lowered)

    return None


def _to_float(value: Any) -> float | None:
    if value is None or value == "":
        return None

    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _normalize_text(value: Any) -> str:
    if value is None:
        return ""

    return str(value).strip()


def _add_unique(items: list[str], new_item: str) -> None:
    normalized_new = new_item.strip().lower()
    if not normalized_new:
        return

    existing = {item.strip().lower() for item in items}
    if normalized_new not in existing:
        items.append(new_item)


def build_additional_recommendations(
    predicted_class: str,
    bmi: float | None,
    input_data: dict[str, Any] | None,
) -> list[str]:
    recommendations: list[str] = []

    favc = _normalize_text(_get_value(input_data, "favc", "FAVC"))
    fcvc = _to_float(_get_value(input_data, "fcvc", "FCVC"))
    ncp = _to_float(_get_value(input_data, "ncp", "NCP"))
    caec = _normalize_text(_get_value(input_data, "caec", "CAEC"))
    ch2o = _to_float(_get_value(input_data, "ch2o", "CH2O"))
    faf = _to_float(_get_value(input_data, "faf", "FAF"))
    tue = _to_float(_get_value(input_data, "tue", "TUE"))
    calc = _normalize_text(_get_value(input_data, "calc", "CALC"))

    if favc.lower() == "yes":
        _add_unique(
            recommendations,
            "Batasi konsumsi makanan tinggi kalori atau fast food.",
        )

    if fcvc is not None and fcvc <= 1:
        _add_unique(
            recommendations,
            "Tingkatkan konsumsi sayur dalam pola makan.",
        )

    if ch2o is not None and ch2o <= 1:
        _add_unique(
            recommendations,
            "Perhatikan konsumsi air harian secara cukup.",
        )

    if faf is not None and faf <= 1:
        _add_unique(
            recommendations,
            "Tingkatkan aktivitas fisik secara bertahap sesuai kemampuan.",
        )

    if caec in {"Frequently", "Always"}:
        _add_unique(
            recommendations,
            "Kurangi kebiasaan makan di antara waktu makan utama.",
        )

    if tue is not None and tue >= 2:
        _add_unique(
            recommendations,
            "Kurangi durasi aktivitas sedentari dan imbangi dengan aktivitas fisik.",
        )

    if calc in {"Frequently", "Always"}:
        _add_unique(
            recommendations,
            "Kurangi konsumsi alkohol.",
        )

    if ncp is not None and ncp <= 1:
        _add_unique(
            recommendations,
            "Perbaiki keteraturan makan utama.",
        )

    if predicted_class in {"Overweight", "Obesity"} and ncp is not None and ncp > 3:
        _add_unique(
            recommendations,
            "Perhatikan frekuensi makan utama agar tetap terkontrol dan tidak berlebihan.",
        )

    if bmi is not None and bmi >= 30:
        _add_unique(
            recommendations,
            "Lakukan pemantauan berkala dan pertimbangkan saran tenaga kesehatan.",
        )

    return recommendations


def merge_unique_recommendations(
    base_recommendations: list[str],
    additional_recommendations: list[str],
) -> list[str]:
    result: list[str] = []

    for item in base_recommendations + additional_recommendations:
        _add_unique(result, item)

    return result


def build_recommendation_summary(
    predicted_class: str,
    bmi: float | None,
    diet_pattern: str,
) -> str:
    bmi_text = f" dengan BMI {bmi:.2f}" if bmi is not None else ""

    return (
        f"Berdasarkan hasil klasifikasi {predicted_class}{bmi_text}, "
        f"sistem merekomendasikan {diet_pattern.lower()} sebagai informasi awal "
        f"untuk membantu pengelolaan pola makan dan kebiasaan hidup."
    )


def format_recommendation_text(plan: dict[str, Any]) -> str:
    lines: list[str] = []

    lines.append(f"Pola diet: {plan.get('diet_pattern', '-')}")
    lines.append("")
    lines.append(f"Ringkasan: {plan.get('recommendation_summary', '-')}")
    lines.append("")
    lines.append("Rekomendasi utama:")

    for item in plan.get("main_recommendations", []):
        lines.append(f"- {item}")

    lines.append("")
    lines.append("Jadwal makan:")

    for item in plan.get("meal_schedule", []):
        time = item.get("time", "-")
        recommendation = item.get("recommendation", "-")
        lines.append(f"- {time}: {recommendation}")

    lines.append("")
    lines.append("Catatan:")

    for item in plan.get("additional_notes", []):
        lines.append(f"- {item}")

    return "\n".join(lines)


def get_recommendation_plan(
    predicted_class: str,
    bmi: float | None = None,
    input_data: dict[str, Any] | None = None,
) -> dict[str, Any]:
    normalized_class = normalize_class_name(predicted_class)
    rule = DIET_RULES.get(normalized_class, DIET_RULES["Normal"])

    additional_recommendations = build_additional_recommendations(
        predicted_class=normalized_class,
        bmi=bmi,
        input_data=input_data,
    )

    final_recommendations = merge_unique_recommendations(
        base_recommendations=rule["main_recommendations"],
        additional_recommendations=additional_recommendations,
    )

    diet_pattern = rule["diet_pattern"]
    recommendation_summary = build_recommendation_summary(
        predicted_class=normalized_class,
        bmi=bmi,
        diet_pattern=diet_pattern,
    )

    additional_notes = [
        "Hasil sistem bersifat informasi awal dan alat bantu.",
        "Rekomendasi ini tidak menggantikan saran tenaga kesehatan.",
    ]

    if rule["early_warning"] == "Risiko Tinggi":
        additional_notes.append(
            "Untuk kondisi risiko tinggi, disarankan melakukan pemantauan berkala bersama tenaga kesehatan."
        )

    plan = {
        "diet_pattern": diet_pattern,
        "early_warning": rule["early_warning"],
        "goal": rule["goal"],
        "recommendation_summary": recommendation_summary,
        "main_recommendations": final_recommendations,
        "meal_schedule": rule["meal_schedule"],
        "additional_notes": additional_notes,
        "method": METHOD_NAME,
        "source_basis": rule.get("source_basis", []),
        "source_references": SOURCE_BASIS,
    }

    plan["recommendation"] = format_recommendation_text(plan)

    return plan


def get_recommendation(predicted_class: str) -> dict[str, str]:
    plan = get_recommendation_plan(predicted_class=predicted_class)
    return {
        "recommendation": plan["recommendation"],
        "early_warning": plan["early_warning"],
    }


def get_recommendation_and_warning(
    predicted_class: str,
    bmi: float | None = None,
    input_data: dict[str, Any] | None = None,
) -> tuple[str, str]:
    """
    Backward compatibility untuk kode lama.
    Return:
    - recommendation text
    - early_warning
    """
    plan = get_recommendation_plan(
        predicted_class=predicted_class,
        bmi=bmi,
        input_data=input_data,
    )
    return plan["recommendation"], plan["early_warning"]

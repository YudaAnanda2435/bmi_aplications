from __future__ import annotations

from datetime import datetime
from io import BytesIO
from typing import Any
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    ListFlowable,
    ListItem,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


DISCLAIMER = (
    "Hasil sistem bersifat informasi awal dan alat bantu. Hasil ini tidak "
    "menggantikan saran dokter, ahli gizi, atau tenaga kesehatan."
)


def _safe_text(value: Any, fallback: str = "-") -> str:
    if value is None:
        return fallback
    text = str(value).strip()
    return text if text else fallback


def _format_number(value: Any, suffix: str = "") -> str:
    if value in (None, ""):
        return "-"
    try:
        number = float(value)
    except (TypeError, ValueError):
        return _safe_text(value)

    if number.is_integer():
        formatted = str(int(number))
    else:
        formatted = f"{number:.2f}".rstrip("0").rstrip(".")
    return f"{formatted}{suffix}"


def _format_datetime(value: Any) -> str:
    if value in (None, ""):
        return "-"
    if isinstance(value, datetime):
        parsed = value
    else:
        text = str(value).replace("Z", "+00:00")
        try:
            parsed = datetime.fromisoformat(text)
        except ValueError:
            return str(value)

    month_names = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ]
    return (
        f"{parsed.day} {month_names[parsed.month - 1]} {parsed.year}, "
        f"{parsed.hour:02d}.{parsed.minute:02d}"
    )


def _normalize_list(value: Any) -> list[Any]:
    if value is None:
        return []
    if isinstance(value, list):
        return value
    if isinstance(value, tuple):
        return list(value)
    if isinstance(value, dict):
        return list(value.values())
    return [value]


def _normalize_source_references(value: Any) -> list[dict[str, Any]]:
    items = _normalize_list(value)
    references: list[dict[str, Any]] = []

    for item in items:
        if isinstance(item, dict):
            references.append(
                {
                    "name": item.get("name") or item.get("title") or "-",
                    "used_for": _normalize_list(item.get("used_for")),
                    "url": item.get("url") or item.get("link"),
                }
            )
        else:
            references.append({"name": str(item), "used_for": [], "url": None})

    return references


def _format_probability(value: Any) -> str:
    if value in (None, ""):
        return "-"
    try:
        number = float(value)
    except (TypeError, ValueError):
        return _safe_text(value)

    percent = number * 100 if 0 <= number <= 1 else number
    return f"{percent:.2f}%"


def _paragraph(text: Any, style: ParagraphStyle) -> Paragraph:
    return Paragraph(escape(_safe_text(text)).replace("\n", "<br/>"), style)


def _section_title(title: str, styles: dict[str, ParagraphStyle]) -> list[Any]:
    return [Spacer(1, 0.28 * cm), Paragraph(title, styles["section_title"]), Spacer(1, 0.12 * cm)]


def _key_value_table(
    rows: list[tuple[str, Any]],
    styles: dict[str, ParagraphStyle],
    col_widths: list[float] | None = None,
) -> Table:
    table_data = [
        [
            _paragraph(label, styles["table_label"]),
            _paragraph(value, styles["table_value"]),
        ]
        for label, value in rows
    ]
    table = Table(table_data, colWidths=col_widths or [5.2 * cm, 10.6 * cm], hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D9E2D6")),
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F3F7F1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return table


def _bullet_list(items: Any, styles: dict[str, ParagraphStyle], fallback: str) -> Any:
    normalized = [_safe_text(item) for item in _normalize_list(items) if _safe_text(item, "")]
    if not normalized:
        return _paragraph(fallback, styles["body"])

    return ListFlowable(
        [ListItem(_paragraph(item, styles["body"]), leftIndent=12) for item in normalized],
        bulletType="bullet",
        leftIndent=18,
        bulletFontName="Helvetica",
        bulletFontSize=7,
    )


def _meal_schedule_table(items: Any, styles: dict[str, ParagraphStyle]) -> Any:
    schedules = _normalize_list(items)
    if not schedules:
        return _paragraph("Jadwal makan belum tersedia untuk data laporan lama.", styles["body"])

    rows = [
        [
            _paragraph("Waktu", styles["table_header"]),
            _paragraph("Rekomendasi", styles["table_header"]),
        ]
    ]

    for item in schedules:
        if isinstance(item, dict):
            time = (
                item.get("time")
                or item.get("meal_time")
                or item.get("title")
                or item.get("label")
                or "-"
            )
            recommendation = (
                item.get("recommendation")
                or item.get("description")
                or item.get("text")
                or item.get("menu")
                or "-"
            )
        else:
            time = "-"
            recommendation = item

        rows.append(
            [
                _paragraph(time, styles["table_value"]),
                _paragraph(recommendation, styles["table_value"]),
            ]
        )

    table = Table(rows, colWidths=[3.8 * cm, 12 * cm], repeatRows=1, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D9E2D6")),
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#3A6936")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return table


def _source_flowables(
    source_basis: Any,
    source_references: Any,
    styles: dict[str, ParagraphStyle],
) -> list[Any]:
    flowables: list[Any] = []
    references = _normalize_source_references(source_references)

    if references:
        for reference in references:
            flowables.append(_paragraph(reference.get("name"), styles["body_bold"]))
            used_for = [
                str(item)
                for item in _normalize_list(reference.get("used_for"))
                if _safe_text(item, "")
            ]
            if used_for:
                flowables.append(
                    _paragraph(
                        "Digunakan untuk: " + ", ".join(used_for),
                        styles["small"],
                    )
                )
            flowables.append(Spacer(1, 0.08 * cm))
        return flowables

    basis_items = [_safe_text(item) for item in _normalize_list(source_basis) if _safe_text(item, "")]
    if basis_items:
        flowables.append(_bullet_list(basis_items, styles, ""))
        return flowables

    flowables.append(
        _paragraph(
            "Dasar rekomendasi mengikuti pedoman gizi seimbang dan aturan rekomendasi sistem.",
            styles["body"],
        )
    )
    return flowables


def _footer(canvas: Any, doc: Any) -> None:
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#64748B"))
    canvas.drawString(doc.leftMargin, 1.1 * cm, DISCLAIMER)
    canvas.drawRightString(A4[0] - doc.rightMargin, 0.75 * cm, f"Halaman {doc.page}")
    canvas.restoreState()


def _build_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "ReportTitle",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=18,
            leading=24,
            textColor=colors.HexColor("#1F3F1D"),
            alignment=TA_CENTER,
            spaceAfter=6,
        ),
        "subtitle": ParagraphStyle(
            "ReportSubtitle",
            parent=base["BodyText"],
            fontSize=10,
            leading=14,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#475569"),
            spaceAfter=10,
        ),
        "section_title": ParagraphStyle(
            "SectionTitle",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=16,
            textColor=colors.HexColor("#1F3F1D"),
            spaceBefore=4,
            spaceAfter=4,
        ),
        "body": ParagraphStyle(
            "ReportBody",
            parent=base["BodyText"],
            fontSize=9,
            leading=13,
            textColor=colors.HexColor("#1F2937"),
        ),
        "body_bold": ParagraphStyle(
            "ReportBodyBold",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=9,
            leading=13,
            textColor=colors.HexColor("#1F2937"),
        ),
        "small": ParagraphStyle(
            "ReportSmall",
            parent=base["BodyText"],
            fontSize=8,
            leading=11,
            textColor=colors.HexColor("#64748B"),
        ),
        "table_label": ParagraphStyle(
            "TableLabel",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=11,
            textColor=colors.HexColor("#475569"),
        ),
        "table_value": ParagraphStyle(
            "TableValue",
            parent=base["BodyText"],
            fontSize=8.5,
            leading=12,
            textColor=colors.HexColor("#111827"),
        ),
        "table_header": ParagraphStyle(
            "TableHeader",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=8.5,
            leading=12,
            textColor=colors.white,
        ),
    }


def build_report_pdf(report: dict[str, Any]) -> bytes:
    buffer = BytesIO()
    styles = _build_styles()
    resident = report.get("resident") or {}
    classification = report.get("classification") or {}
    probabilities = classification.get("probabilities") or {}

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=1.8 * cm,
        bottomMargin=1.8 * cm,
        title="DietCare - Laporan Klasifikasi Status Obesitas",
        author="DietCare",
    )

    story: list[Any] = [
        Paragraph("DietCare - Laporan Klasifikasi Status Obesitas", styles["title"]),
        Paragraph("Sistem Klasifikasi Status Obesitas dan Rekomendasi Pola Diet", styles["subtitle"]),
        Paragraph(f"Tanggal cetak: {_format_datetime(datetime.now())}", styles["subtitle"]),
        Spacer(1, 0.18 * cm),
    ]

    story.extend(_section_title("Identitas Penduduk", styles))
    story.append(
        _key_value_table(
            [
                ("Nama Penduduk", resident.get("name")),
                ("Jenis Kelamin", resident.get("gender")),
                ("Usia", _format_number(resident.get("age"), " tahun")),
                ("Tinggi Badan", _format_number(resident.get("height"), " m")),
                ("Berat Badan", _format_number(resident.get("weight"), " kg")),
                ("BMI", _format_number(classification.get("bmi") or resident.get("bmi"))),
                ("Tanggal Klasifikasi", _format_datetime(classification.get("created_at"))),
            ],
            styles,
        )
    )

    story.extend(_section_title("Hasil Klasifikasi", styles))
    story.append(
        _key_value_table(
            [
                ("Hasil Klasifikasi", classification.get("predicted_class")),
                ("Peringatan Dini", classification.get("early_warning")),
                ("Pola Diet", classification.get("diet_pattern")),
                ("Tujuan Rekomendasi", classification.get("goal")),
                ("Metode Rekomendasi", classification.get("method")),
            ],
            styles,
        )
    )

    story.extend(_section_title("Ringkasan Rekomendasi", styles))
    summary = classification.get("recommendation_summary") or classification.get("recommendation")
    story.append(_paragraph(summary, styles["body"]))

    story.extend(_section_title("Rekomendasi Utama", styles))
    story.append(
        _bullet_list(
            classification.get("main_recommendations"),
            styles,
            _safe_text(classification.get("recommendation"), "Rekomendasi belum tersedia."),
        )
    )

    story.extend(_section_title("Jadwal Makan", styles))
    story.append(_meal_schedule_table(classification.get("meal_schedule"), styles))

    story.extend(_section_title("Probabilitas Klasifikasi", styles))
    probability_rows = [
        (label, _format_probability(value))
        for label, value in probabilities.items()
        if value is not None
    ]
    if probability_rows:
        story.append(_key_value_table(probability_rows, styles))
    else:
        story.append(_paragraph("Probabilitas belum tersedia.", styles["body"]))

    story.extend(_section_title("Catatan Sistem", styles))
    story.append(
        _bullet_list(
            classification.get("additional_notes") or classification.get("note"),
            styles,
            DISCLAIMER,
        )
    )

    story.extend(_section_title("Dasar Rekomendasi", styles))
    story.extend(
        _source_flowables(
            classification.get("source_basis"),
            classification.get("source_references"),
            styles,
        )
    )

    story.extend(_section_title("Footer Laporan", styles))
    story.append(_paragraph(DISCLAIMER, styles["small"]))

    doc.build(story, onFirstPage=_footer, onLaterPages=_footer)
    buffer.seek(0)
    return buffer.getvalue()

export const DEFAULT_RECOMMENDATION_METHOD =
  "Rule-Based Recommendation / Forward Chaining";

export const DEFAULT_SYSTEM_NOTE =
  "Hasil sistem bersifat informasi awal dan tidak menggantikan saran tenaga kesehatan.";

const dietPatternByClass = {
  Underweight: "Pola Diet Peningkatan Asupan Gizi Seimbang",
  Normal: "Pola Diet Pemeliharaan Gizi Seimbang",
  Overweight: "Pola Diet Kontrol Berat Badan",
  Obesity: "Pola Diet Rendah Kalori Terkontrol",
};

function unwrapApiData(result) {
  let payload = result || {};

  for (let index = 0; index < 3; index += 1) {
    const keys = payload && typeof payload === "object" ? Object.keys(payload) : [];
    const looksLikeWrapper =
      payload &&
      typeof payload === "object" &&
      payload.data &&
      typeof payload.data === "object" &&
      ("success" in payload ||
        "message" in payload ||
        "status" in payload ||
        "headers" in payload ||
        "config" in payload ||
        (keys.length === 1 && keys[0] === "data"));

    if (!looksLikeWrapper) {
      break;
    }

    payload = payload.data;
  }

  return payload;
}

function toCamelCase(value) {
  return String(value).replace(/_([a-z])/g, (_, letter) =>
    letter.toUpperCase()
  );
}

function getClassificationSource(result) {
  return (
    result.classification ||
    result.classification_result ||
    result.result ||
    {}
  );
}

function getValue(result, field) {
  const payload = unwrapApiData(result);
  const classification = getClassificationSource(payload);
  const camelField = toCamelCase(field);

  return (
    payload[field] ??
    payload[camelField] ??
    classification[field] ??
    classification[camelField] ??
    ""
  );
}

function hasValue(value) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (value && typeof value === "object") {
    return Object.keys(value).length > 0;
  }

  return value !== null && value !== undefined && String(value).trim() !== "";
}

function stripListMarker(value) {
  return String(value || "")
    .trim()
    .replace(/^[-*\u2022]\s*/, "")
    .trim();
}

function parseMealScheduleLine(value) {
  const text = stripListMarker(value);

  if (!text) {
    return null;
  }

  const match = text.match(/^([^:]+):\s*(.+)$/);

  if (!match) {
    return {
      time: "Jadwal Makan",
      recommendation: text,
    };
  }

  return {
    time: match[1].trim(),
    recommendation: match[2].trim(),
  };
}

function normalizeSectionName(sectionName) {
  const normalizedName = sectionName.toLowerCase().trim();

  if (normalizedName === "pola diet") {
    return "diet_pattern";
  }

  if (normalizedName === "ringkasan") {
    return "recommendation_summary";
  }

  if (normalizedName === "rekomendasi utama") {
    return "main_recommendations";
  }

  if (normalizedName === "jadwal makan") {
    return "meal_schedule";
  }

  if (normalizedName === "catatan") {
    return "additional_notes";
  }

  return "";
}

function appendParsedSectionValue(parsed, section, value) {
  const text = String(value || "").trim();

  if (!section || !text) {
    return;
  }

  if (section === "diet_pattern" || section === "recommendation_summary") {
    parsed[section] = parsed[section]
      ? `${parsed[section]} ${stripListMarker(text)}`
      : stripListMarker(text);
    return;
  }

  if (section === "main_recommendations") {
    const item = stripListMarker(text);

    if (item) {
      parsed.main_recommendations.push(item);
    }
    return;
  }

  if (section === "meal_schedule") {
    const item = parseMealScheduleLine(text);

    if (item?.recommendation) {
      parsed.meal_schedule.push(item);
    }
    return;
  }

  if (section === "additional_notes") {
    const item = stripListMarker(text);

    if (item) {
      parsed.additional_notes.push(item);
    }
  }
}

export function parseCombinedRecommendation(recommendationText) {
  const parsed = {
    diet_pattern: "",
    recommendation_summary: "",
    main_recommendations: [],
    meal_schedule: [],
    additional_notes: [],
    has_sections: false,
  };

  if (typeof recommendationText !== "string" || !recommendationText.trim()) {
    return parsed;
  }

  let currentSection = "";
  const lines = recommendationText.split(/\r?\n/);
  const headingPattern =
    /^(pola diet|ringkasan|rekomendasi utama|jadwal makan|catatan)\s*:\s*(.*)$/i;

  lines.forEach((line) => {
    const text = String(line || "").trim();

    if (!text) {
      return;
    }

    const headingMatch = text.match(headingPattern);

    if (headingMatch) {
      currentSection = normalizeSectionName(headingMatch[1]);
      parsed.has_sections = true;
      appendParsedSectionValue(parsed, currentSection, headingMatch[2]);
      return;
    }

    appendParsedSectionValue(parsed, currentSection, text);
  });

  return parsed;
}

function normalizeProbabilityMap(result) {
  const payload = unwrapApiData(result);
  const classification = getClassificationSource(payload);
  const probabilities = payload.probabilities || classification.probabilities;

  if (probabilities && typeof probabilities === "object") {
    return probabilities;
  }

  const probabilityMap = {
    Underweight:
      payload.probability_underweight ?? classification.probability_underweight,
    Normal: payload.probability_normal ?? classification.probability_normal,
    Overweight:
      payload.probability_overweight ?? classification.probability_overweight,
    Obesity: payload.probability_obesity ?? classification.probability_obesity,
  };

  return Object.values(probabilityMap).some(
    (value) => value !== null && value !== undefined && value !== ""
  )
    ? probabilityMap
    : null;
}

function normalizeRecommendationItems(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        typeof item === "string"
          ? item
          : item?.recommendation || item?.description || item?.text || ""
      )
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(/\n|;|\u2022/)
      .map((item) => item.trim().replace(/^-+\s*/, ""))
      .filter(Boolean);
  }

  return [];
}

function normalizeSourceBasis(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (item && typeof item === "object") {
          return item.name || item.title || item.label || item.source || "";
        }

        return "";
      })
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(/\n|;/)
      .map((item) => stripListMarker(item))
      .filter(Boolean);
  }

  if (value && typeof value === "object") {
    return Object.values(value)
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (item && typeof item === "object") {
          return item.name || item.title || item.label || item.source || "";
        }

        return "";
      })
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeUsedFor(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || "").trim())
      .filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(/\n|;/)
      .map((item) => stripListMarker(item))
      .filter(Boolean);
  }

  return [];
}

function normalizeSourceReferences(value) {
  const values = Array.isArray(value)
    ? value
    : value && typeof value === "object"
      ? Object.values(value)
      : typeof value === "string" && value.trim()
        ? [value]
        : [];

  return values
    .map((item) => {
      if (typeof item === "string") {
        return {
          name: item.trim(),
          used_for: [],
          url: "",
        };
      }

      if (!item || typeof item !== "object") {
        return null;
      }

      const name =
        item.name ||
        item.title ||
        item.label ||
        item.source ||
        item.reference ||
        "";

      return {
        name: String(name).trim(),
        used_for: normalizeUsedFor(item.used_for || item.usedFor || item.scope),
        url: String(item.url || item.link || item.href || "").trim(),
      };
    })
    .filter((item) => item?.name);
}

function parseScheduleString(value) {
  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return normalizeMealSchedule(parsed);
  } catch {
    return [
      {
        time: "Jadwal Makan",
        recommendation: value.trim(),
      },
    ];
  }
}

export function normalizeMealSchedule(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => ({
        time:
          item?.time ||
          item?.meal_time ||
          item?.label ||
          item?.waktu ||
          item?.title ||
          "Waktu makan",
        recommendation:
          item?.recommendation ||
          item?.description ||
          item?.menu ||
          item?.detail ||
          item?.text ||
          "",
      }))
      .map((item) => ({
        time: String(item.time).trim(),
        recommendation: String(item.recommendation).trim(),
      }))
      .filter((item) => item.recommendation);
  }

  if (typeof value === "string") {
    return parseScheduleString(value);
  }

  if (value && typeof value === "object") {
    return Object.entries(value)
      .map(([time, recommendation]) => ({
        time,
        recommendation:
          typeof recommendation === "string"
            ? recommendation
            : recommendation?.recommendation ||
              recommendation?.description ||
              recommendation?.menu ||
              recommendation?.detail ||
              recommendation?.text ||
              "",
      }))
      .map((item) => ({
        time: String(item.time).trim(),
        recommendation: String(item.recommendation).trim(),
      }))
      .filter((item) => item.recommendation);
  }

  return parseScheduleString(value);
}

export function normalizePredictionResult(result) {
  const payload = unwrapApiData(result);
  const classification = getClassificationSource(payload);
  const predictedClass = getValue(payload, "predicted_class");
  const rawRecommendation = getValue(payload, "recommendation");
  const rawMainRecommendations = getValue(payload, "main_recommendations");
  const parsedRecommendation = parseCombinedRecommendation(rawRecommendation);
  const parsedMainRecommendationText =
    typeof rawMainRecommendations === "string"
      ? parseCombinedRecommendation(rawMainRecommendations)
      : parseCombinedRecommendation("");
  const parsedSource = parsedRecommendation.has_sections
    ? parsedRecommendation
    : parsedMainRecommendationText.has_sections
      ? parsedMainRecommendationText
      : parsedRecommendation;
  const structuredRecommendationSummary = getValue(
    payload,
    "recommendation_summary"
  );
  const recommendationSummary =
    structuredRecommendationSummary ||
    parsedSource.recommendation_summary ||
    (parsedSource.has_sections ? "" : rawRecommendation);
  const normalizedMainRecommendations = parsedMainRecommendationText.has_sections
    ? []
    : normalizeRecommendationItems(rawMainRecommendations);
  const mainRecommendations = normalizedMainRecommendations.length
    ? normalizedMainRecommendations
    : parsedSource.main_recommendations.length
      ? parsedSource.main_recommendations
      : normalizeRecommendationItems(recommendationSummary);
  const rawMealSchedule = getValue(payload, "meal_schedule");
  const normalizedMealSchedule = normalizeMealSchedule(rawMealSchedule);
  const structuredAdditionalNotes = getValue(payload, "additional_notes");
  const goal = getValue(payload, "goal");
  const directSourceBasis = normalizeSourceBasis(getValue(payload, "source_basis"));
  const sourceReferences = normalizeSourceReferences(
    getValue(payload, "source_references")
  );
  const sourceReferencesBasis = sourceReferences.map((source) => source.name);
  const sourceBasis = directSourceBasis.length
    ? directSourceBasis
    : sourceReferencesBasis;

  return {
    ...payload,
    classification,
    predicted_class: predictedClass,
    bmi:
      getValue(payload, "bmi") ||
      payload.resident?.bmi ||
      classification.resident?.bmi ||
      "",
    probabilities: normalizeProbabilityMap(payload),
    diet_pattern:
      getValue(payload, "diet_pattern") ||
      parsedSource.diet_pattern ||
      dietPatternByClass[predictedClass] ||
      "Pola diet belum tersedia",
    recommendation_summary: recommendationSummary,
    recommendation: rawRecommendation,
    goal,
    main_recommendations: mainRecommendations,
    meal_schedule: normalizedMealSchedule.length
      ? normalizedMealSchedule
      : parsedSource.meal_schedule,
    additional_notes:
      (hasValue(structuredAdditionalNotes)
        ? structuredAdditionalNotes
        : parsedSource.additional_notes.length
          ? parsedSource.additional_notes
          : "") ||
      getValue(payload, "note") ||
      DEFAULT_SYSTEM_NOTE,
    method: getValue(payload, "method") || DEFAULT_RECOMMENDATION_METHOD,
    source_basis: sourceBasis,
    source_references: sourceReferences,
    early_warning: getValue(payload, "early_warning"),
    note: getValue(payload, "note"),
  };
}

import {
  DEFAULT_RECOMMENDATION_METHOD,
  DEFAULT_SYSTEM_NOTE,
  normalizePredictionResult,
} from "../../../utils/predictionNormalizer";

export { DEFAULT_RECOMMENDATION_METHOD, DEFAULT_SYSTEM_NOTE };

export function getPredictedClass(result = {}) {
  return normalizePredictionResult(result).predicted_class || "";
}

export function getBmi(result = {}) {
  return normalizePredictionResult(result).bmi ?? "";
}

export function getEarlyWarning(result = {}) {
  return normalizePredictionResult(result).early_warning || "";
}

export function getDietPattern(result = {}) {
  return normalizePredictionResult(result).diet_pattern;
}

export function getRecommendationMethod(result = {}) {
  return normalizePredictionResult(result).method || DEFAULT_RECOMMENDATION_METHOD;
}

export function getRecommendationSummary(result = {}) {
  return normalizePredictionResult(result).recommendation_summary || "";
}

export function getRecommendationGoal(result = {}) {
  return normalizePredictionResult(result).goal || "";
}

export function getMainRecommendations(result = {}) {
  return normalizePredictionResult(result).main_recommendations || [];
}

export function normalizeMealSchedule(result = {}) {
  return normalizePredictionResult(result).meal_schedule || [];
}

export function getAdditionalNotes(result = {}) {
  return normalizePredictionResult(result).additional_notes || DEFAULT_SYSTEM_NOTE;
}

export function getProbabilities(result = {}) {
  return normalizePredictionResult(result).probabilities || null;
}

export function getSourceBasis(result = {}) {
  return normalizePredictionResult(result).source_basis || [];
}

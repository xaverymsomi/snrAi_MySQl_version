import { saveSuggestion, saveSuggestionSentimentAnalysis } from "../models/suggestionModel.js";
import { validateInput } from "../utils/validateInput.js";

export const saveSuggestionService = async (suggestionData) => {
  const validationRules = {
    institution_type: { required: true, filter: "FILTER_VALIDATE_INT" },
    suggestion_description: { required: true, filter: "FILTER_SANITIZE_SPECIAL_CHARS" },
    first_name: { required: false, filter: "FILTER_SANITIZE_SPECIAL_CHARS" },
    middle_name: { required: false, filter: "FILTER_SANITIZE_SPECIAL_CHARS" },
    last_name: { required: false, filter: "FILTER_SANITIZE_SPECIAL_CHARS" },
    email: { required: false, filter: "FILTER_VALIDATE_EMAIL" },
    phone_number: { required: false, filter: "FILTER_SANITIZE_SPECIAL_CHARS" },
    lang: { required: false, filter: "FILTER_SANITIZE_SPECIAL_CHARS" },
    ip: { required: false, filter: "FILTER_SANITIZE_SPECIAL_CHARS" },
    sentiment: { required: false, filter: "FILTER_SANITIZE_SPECIAL_CHARS" },
    priority: { required: false, filter: "FILTER_SANITIZE_SPECIAL_CHARS" },
    toxicityLabels: { required: false, type: "array" },
  };

  const { errors, sanitizedInput } = validateInput(suggestionData, validationRules);
  if (errors.length > 0) {
    throw { validationErrors: errors };
  }

  // Normalize priority
  if (sanitizedInput.priority) {
    sanitizedInput.priority = sanitizedInput.priority.replace(' Priority', '').trim();
  }

  // Save sentiment analysis if available
  let sentimentAnalysisId = null;
  if (
    sanitizedInput.sentiment &&
    sanitizedInput.priority &&
    Array.isArray(sanitizedInput.toxicityLabels)
  ) {
    sentimentAnalysisId = await saveSuggestionSentimentAnalysis(
      sanitizedInput.sentiment,
      sanitizedInput.priority,
      sanitizedInput.toxicityLabels
    );
  }

  // Save main suggestion
  await saveSuggestion({
    ...sanitizedInput,
    sentiment_analysis_id: sentimentAnalysisId,
  });
};

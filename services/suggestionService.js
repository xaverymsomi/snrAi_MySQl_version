import { saveSuggestion } from "../models/suggestionModel.js";
import { validateInput } from "../utils/validateInput.js"; // Assuming validation logic is in a separate file

export const saveSuggestionService = async (suggestionData) => {
  const validationRules = {
    institution_type: { required: true, filter: "FILTER_VALIDATE_INT" },
    suggestion_description: { required: true, filter: "FILTER_SANITIZE_SPECIAL_CHARS" },
    txt_name: { required: false, filter: "FILTER_SANITIZE_SPECIAL_CHARS" }, // Optional field
    email: { required: false, filter: "FILTER_VALIDATE_EMAIL" }, // Optional field
    txt_phone: { required: false, filter: "FILTER_SANITIZE_SPECIAL_CHARS" }, // Optional field
  };

  // Perform validation
  const { errors, sanitizedInput } = validateInput(suggestionData, validationRules);

  if (errors.length > 0) {
    throw { validationErrors: errors }; // Throw error if validation fails
  }

  // Save suggestion to the database if validation passes
  await saveSuggestion(sanitizedInput);
};

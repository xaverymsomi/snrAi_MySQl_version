// src/controllers/suggestionController.js
import { saveSuggestionService } from "../services/suggestionService.js";

const saveSuggestions = async (req, res) => {
  try {
    const suggestionData = req.body;

    // Call the service to handle saving the suggestion
    await saveSuggestionService(suggestionData);

    return res.status(200).json({
      code: 200,
      message: "Successfully saved suggestion.",
    });
  } catch (err) {
    if (err.validationErrors) {
      return res.status(400).json({
        code: 100,
        message: "Validation failed",
        errors: err.validationErrors,
      });
    }
    console.error(err);
    return res.status(500).json({
      code: 100,
      message: "Failed to save suggestion: " + err.message,
      trace: err.stack,
    });
  }
};

export default saveSuggestions;
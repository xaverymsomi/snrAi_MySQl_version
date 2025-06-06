import { saveComplaintToDb, saveSuggestion, sendNotifications, saveSentimentAnalysis } from '../models/complaintModel.js';
import { validateComplaintInput } from '../utils/validateInput.js';

export const saveComplaintService = async (complaintData) => {
  const required_params = {
    institution_type: { required: true },
    complaint_description: { required: true },
    suggestion_description: { required: false },
    complaint_category: { required: true },
    person_responsible: { required: false },
    first_name: { required: false },
    middle_name: { required: false },
    last_name: { required: false },
    email: { required: false },
    phone_number: { required: false },
    lang: { required: false },
    ip: { required: false },
    sentiment: { required: false },
    priority: { required: false },
    toxicityLabels: { required: false }
  };

  const { errors, sanitizedInput } = validateComplaintInput(complaintData, required_params);

  if (errors.length > 0) {
    throw { validationErrors: errors };
  }

  const complaint = await saveComplaintToDb(sanitizedInput);
  if (sanitizedInput.suggestion_description) {
    await saveSuggestion({
      opt_mx_complaint_id: complaint.id,
      tar_suggestion_description: sanitizedInput.suggestion_description,
      opt_mx_institution_id: sanitizedInput.institution_type
    });
  }
 // Normalize priority
if (sanitizedInput.priority) {
  sanitizedInput.priority = sanitizedInput.priority.replace(' Priority', '').trim();
}
// Save sentiment and toxicity labels if provided
  let sentimentAnalysisId = null;
  if (sanitizedInput.sentiment && sanitizedInput.priority && sanitizedInput.toxicityLabels) {
    sentimentAnalysisId = await saveSentimentAnalysis(
      complaint.id,
      sanitizedInput.sentiment,
      sanitizedInput.priority,
      sanitizedInput.toxicityLabels
    );
  }

  await sendNotifications(sanitizedInput, complaint);

  return { complaint, sentimentAnalysisId };
};

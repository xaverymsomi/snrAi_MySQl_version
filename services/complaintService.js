import { saveComplaintToDb, saveSuggestion, sendNotifications } from '../models/complaintModel.js';
import { validateComplaintInput } from '../utils/validateInput.js';

export const saveComplaintService = async (complaintData) => {
  const required_params = {
    opt_mx_institution_id: { required: true },
    tar_description: { required: true },
    tar_suggestion_description: { required: false },
    opt_mx_category_id: { required: true },
    txt_responsible_person: { required: false },
    txt_name: { required: false },
    email: { required: false },
    txt_phone: { required: false },
    lang: { required: false },
    ip: { required: false }
  };

  const { errors, sanitizedInput } = validateComplaintInput(complaintData, required_params);

  if (errors.length > 0) {
    throw { validationErrors: errors };
  }

  const complaint = await saveComplaintToDb(sanitizedInput);
  if (sanitizedInput.tar_suggestion_description) {
    await saveSuggestion({
      opt_mx_complaint_id: complaint.id,
      tar_suggestion_description: sanitizedInput.tar_suggestion_description,
      opt_mx_institution_id: sanitizedInput.opt_mx_institution_id
    });
  }

  await sendNotifications(sanitizedInput, complaint);

  return complaint;
};

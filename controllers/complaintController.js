import { saveComplaintService } from '../services/complaintService.js';
import { handleSuccessResponse, handleErrorResponse } from '../utils/responseHandler.js';

const saveComplaint = async (req, res) => {
  try {
    // Validate request body
    const result = await saveComplaintService(req.body);

    return res.json(handleSuccessResponse("Complaint saved successfully", result));
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json(handleErrorResponse(100, "Internal server error"));
  }
};

export default saveComplaint;
// File: src/controllers/complaintController.js
import { checkComplaintStatusService } from '../services/complaintStatusService.js';
import { handleSuccessResponse, handleErrorResponse } from '../utils/responseHandler.js';

// Sanitize user input
function sanitizeInput(input) {
    if (!input) return '';
    return input.toString().replace(/[^\w\s@.-]/gi, '');
}

const checkComplaintStatus = async (req, res) => {
    try {
        const reference = sanitizeInput(req.body.reference_number);
        const pin = sanitizeInput(req.body.pin);
     // Debugging line
        

        if (!reference || !pin) {
            return res.status(400).json({ response: handleErrorResponse("Reference and PIN are required") });
        }

        const { complaint, notifications } = await checkComplaintStatusService(reference, pin);

        const response = handleSuccessResponse();
        response.data = complaint;
        response.data.notifications = notifications;

        return res.json({ response });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ response: handleErrorResponse(error.message) });
    }
}

export default checkComplaintStatus;
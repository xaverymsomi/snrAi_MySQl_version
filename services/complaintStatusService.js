// File: src/services/complaintService.js
import { findComplaintByReferenceAndPin, findComplaintRequests, createHash } from '../models/complaintStatusModel.js';

export async function checkComplaintStatusService(reference, pin) {
    const hashedPin = createHash('SHA256', pin, 'RaHiSiTa30%Du10%Mo40%Ba20%');
    console.log("Reference:", reference, "PIN:", hashedPin);
    const complaints = await findComplaintByReferenceAndPin(reference, hashedPin);
    if (complaints.length === 0) {
        throw new Error('No Record Found');
    }

    const complaint = complaints[0];
    const notifications = await findComplaintRequests(complaint.complaint_id);

    return {
        complaint,
        notifications
    };
}
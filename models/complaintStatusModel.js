// src/models/complaintModel.js
import db from '../config/db.js';

// Hash function (move here or to utils)
import crypto from 'crypto';
function createHash(algorithm, text, salt) {
    return crypto.createHmac(algorithm, salt)
                 .update(text)
                 .digest('hex');
}

// Fetch complaint details
export async function findComplaintByReferenceAndPin(reference, pin) {
    try {
        const [rows] = await db.promise().query(`
            SELECT mx_complaint.txt_reference,
                mx_complaint.txt_row_value as complaint_id,
                mx_complaint.tar_description,
                mx_complaint.email,
                mx_complaint.txt_pin,
                mx_complaint.txt_phone,
                mx_complaint.txt_name AS Complainer,
                mx_complaint.dat_date_launched,
                mx_complaint.txt_responsible_person,
                mx_category.txt_name AS Category_English,
                mx_category.txt_name_swahili AS Category_Kiswahili,
                mx_institution.txt_name AS Institution_English,
                mx_institution.txt_name_swahili AS Institution_Kiswahili,
                mx_suggestion.tar_description AS Suggestion,
                mx_complaint_status.txt_name AS Status_English,
                mx_complaint_status.txt_name_swahili AS Status_Kiswahili
            FROM mx_complaint 
            JOIN mx_category ON mx_category.id = mx_complaint.opt_mx_category_id
            JOIN mx_complaint_status ON mx_complaint.opt_mx_complaint_status_id = mx_complaint_status.id 
            LEFT JOIN mx_suggestion ON mx_suggestion.opt_mx_complaint_id = mx_complaint.id
            LEFT JOIN mx_institution ON mx_complaint.opt_mx_institution_id = mx_institution.id
            WHERE mx_complaint.txt_reference = ? AND mx_complaint.txt_pin = ?
        `, [reference, pin]);

        return rows; // Returning the rows directly
    } catch (error) {
        console.error('Error fetching complaint by reference and pin:', error);
        throw error; // Re-throw error to be handled elsewhere
    }
}

// Fetch complaint requests
export async function findComplaintRequests(complaint_id) {
    try {
        const [rows] = await db.promise().query(`
            SELECT * FROM mx_complaint_requests_view WHERE complaint_row_id = ?
        `, [complaint_id]);

        return rows;
    } catch (error) {
        console.error('Error fetching complaint requests:', error);
        throw error;
    }
}

// Expose createHash if needed
export { createHash };

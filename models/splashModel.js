// src/models/splashModel.js
import db from "../config/db.js";

// Promise-based wrapper
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

export const fetchInstitutions = async () => {
  const sql = `
    SELECT id, int_institution_code AS institution_code,
           txt_name AS institution_name_English,
           txt_name_swahili AS institution_name_Kiswahili
    FROM mx_institution
    WHERE opt_mx_status_id = 1
  `;
  return await query(sql);
};

export const fetchCategories = async () => {
  const sql = `
    SELECT id, txt_name AS name_English,
           txt_name_swahili AS name_Kiswahili,
           txt_icon AS icon, txt_color AS color
    FROM mx_category
  `;
  return await query(sql);
};

export const fetchFaq = async () => {
  const sql = `
    SELECT txt_row_value AS id, tar_question_en AS question_English,
           tar_answer_en AS answer_English, tar_question_sw AS question_Kiswahili,
           tar_answer_sw AS answer_Kiswahili
    FROM mx_faq
  `;
  return await query(sql);
};

export const fetchMonthlyComplaint = async () => {
  const sql = `
    SELECT COUNT(id) AS total
    FROM mx_complaint
    WHERE MONTH(dat_date_launched) = MONTH(CURRENT_DATE())
      AND YEAR(dat_date_launched) = YEAR(CURRENT_DATE())
  `;
  return await query(sql);
};

export const fetchComplaints = async () => {
  const sql = `
    SELECT COUNT(mx_complaint.id) AS total_complaint,
           SUM(CASE WHEN opt_mx_complaint_status_id IN (2,4,5,7) THEN 1 ELSE 0 END) AS active,
           SUM(CASE WHEN opt_mx_complaint_status_id IN (3,6) THEN 1 ELSE 0 END) AS dismissed
    FROM mx_complaint
    JOIN mx_institution ON mx_institution.id = mx_complaint.opt_mx_institution_id
    LEFT JOIN mx_suggestion ON mx_complaint.id = mx_suggestion.opt_mx_complaint_id
  `;
  return await query(sql);
};

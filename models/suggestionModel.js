// src/models/suggestionModel.js
import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

// Function to save the suggestion
export const saveSuggestion = (suggestionData) => {
  return new Promise((resolve, reject) => {
    const {
      opt_mx_institution_id,
      tar_description,
      txt_name,
      email,
      txt_phone
    } = suggestionData;

    const txt_row_value = uuidv4();
    const dat_date = new Date();

    const sql = `
      INSERT INTO mx_suggestion (
        opt_mx_institution_id, tar_description, dat_date,
        txt_name, email, txt_phone, txt_row_value
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      parseInt(opt_mx_institution_id),
      tar_description,
      dat_date,
      txt_name,
      email,
      txt_phone,
      txt_row_value
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("❌ Error inserting suggestion:", err);
        return reject(err);
      }
      resolve({ success: true, insertId: result.insertId });
    });
  });
};

import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

// Function to save the suggestion
export const saveSuggestion = (suggestionData) => {
  return new Promise((resolve, reject) => {
    const {
      institution_type,
      suggestion_description,
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
      parseInt(institution_type),
      suggestion_description,
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

export const saveSuggestionSentimentAnalysis = async (sentiment, priority, toxicityLabels) => {
  const rowValue = uuidv4(); // ✅ FIXED
  const cleanPriority = priority?.replace(' Priority', '').trim();
  const cleanSentiment = sentiment?.trim();

  const [sentimentRows] = await db.promise().query(
    'SELECT id FROM mx_sentiment WHERE txt_name = ?',
    [cleanSentiment]
  );
  if (sentimentRows.length === 0) throw new Error('Sentiment type not found');
  const sentimentId = sentimentRows[0].id;

  const [priorityRows] = await db.promise().query(
    'SELECT id FROM mx_complaint_priority WHERE txt_name = ?',
    [cleanPriority]
  );
  if (priorityRows.length === 0) throw new Error('Priority not found');
  const priorityId = priorityRows[0].id;

  const insertSentimentQuery = `
    INSERT INTO mx_sentiment_analysis (
      opt_mx_complaint_priority_id,
      opt_mx_sentiment_id,
      dat_added_date,
      txt_row_value
    ) VALUES (?, ?, NOW(), ?)
  `;
  const [result] = await db.promise().query(insertSentimentQuery, [
    priorityId,
    sentimentId,
    rowValue
  ]);
  const analysisId = result.insertId;

  for (const label of toxicityLabels) {
    const [labelRows] = await db.promise().query(
      'SELECT id FROM mx_label WHERE txt_name = ?',
      [label.label]
    );
    if (labelRows.length > 0) {
      const labelId = labelRows[0].id;
      const insertScoreQuery = `
        INSERT INTO mx_toxicity_scores (
          dbl_score,
          opt_mx_sentiment_analysis_id,
          opt_mx_label_id,
          dat_added_date,
          txt_row_value
        ) VALUES (?, ?, ?, NOW(), ?)
      `;
      await db.promise().query(insertScoreQuery, [
        label.score,
        analysisId,
        labelId,
        uuidv4() // ✅ FIXED
      ]);
    }
  }

  return analysisId;
};

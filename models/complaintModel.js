import db from '../config/db.js';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// Function to generate a random number (PIN)
function generateRandomNo(length = 4) {
  const characters = '1234567890';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    let character = characters[Math.floor(Math.random() * characters.length)];
    if (i === 0 && character === '0') {
      character = '123456789'[Math.floor(Math.random() * 9)];
    }
    randomString += character;
  }
  return randomString;
}

// Function to generate a unique GUID
function getGUID() {
  const uid = uuidv4();
  const data = [
    Math.floor(Math.random() * 99999) + 11111,
    Date.now(),
    new Date().toISOString(),
    process.hrtime.bigint().toString()
  ].join('');
  const hash = crypto.createHash('ripemd160').update(uid + crypto.createHash('md5').update(data).digest('hex')).digest('hex').toUpperCase();
  return `${hash.substring(0, 8)}-${hash.substring(8, 12)}-${hash.substring(12, 16)}-${hash.substring(16, 20)}-${hash.substring(20, 32)}`;
}

// Function to save a complaint to the database
export const saveComplaintToDb = async (data) => {
  console.log('data:', data);
  const pin = generateRandomNo(4);
  const referenceNumber = 'ZW' + uuidv4().toUpperCase().replace(/-/g, '').substring(0, 10);
  const rowValue = getGUID();

  // Query to get institution details
  const institutionQuery = 'SELECT * FROM mx_institution WHERE id = ?';
  const [institutionRows] = await db.promise().query(institutionQuery, [data.opt_mx_institution_id]);

  if (institutionRows.length === 0) throw new Error('Institution not found');
  const institution = institutionRows[0];

  // Insert complaint into the database
  const insertComplaintQuery = `
    INSERT INTO mx_complaint (
      opt_mx_complaint_status_id, opt_mx_institution_id, opt_mx_category_id,
      tar_description, dat_date_launched, txt_responsible_person,
      txt_name, email, txt_phone, txt_reference,
      opt_mx_complaint_source_id, txt_row_value, txt_ip_address, txt_pin
    ) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  await db.promise().query(insertComplaintQuery, [
    1, // default status
    data.opt_mx_institution_id,
    data.opt_mx_category_id,
    data.tar_description,
    data.txt_responsible_person || null,
    data.txt_name || null,
    data.email || null,
    data.txt_phone || null,
    referenceNumber,
    2, // complaint source (default value)
    rowValue,
    data.ip || null,
    crypto.createHmac('sha256', 'PASS_SALT').update(pin).digest('hex')
  ]);

  // Retrieve the inserted complaint's ID
  const [result] = await db.promise().query('SELECT id FROM mx_complaint WHERE txt_row_value = ?', [rowValue]);

  return {
    id: result[0].id,
    txt_reference: referenceNumber,
    pin,
    institution: institution.txt_name,
    institution_code: institution.int_institution_code
  };
};

// Function to save suggestion to the database
export const saveSuggestion = async (data) => {
  const rowValue = getGUID();

  const insertSuggestionQuery = `
    INSERT INTO mx_suggestion (
      opt_mx_complaint_id, tar_description, dat_date,
      opt_mx_institution_id, txt_row_value
    ) VALUES (?, ?, NOW(), ?, ?)
  `;

  await db.promise().query(insertSuggestionQuery, [
    data.opt_mx_complaint_id,
    data.tar_suggestion_description,
    data.opt_mx_institution_id,
    rowValue
  ]);
};

// Function to send notifications
export const sendNotifications = async (data, complaint) => {
  console.log('Sending notifications for complaint:', complaint.txt_reference);
  // Logic to send notifications (SMS/Email/Push)
};
// utils/validateInput.js
export const validateInput = (input, rules) => {
    const errors = [];
  
    // Check if input is defined and not null
    if (!input || typeof input !== 'object') {
      errors.push("Input data is invalid.");
      return { errors, sanitizedInput: {} };
    }
  
    for (const [key, rule] of Object.entries(rules)) {
      console.log(`Validating ${key}:`, input[key]);
  
      // Check for required fields
      if (rule.required && (input[key] === undefined || input[key] === null || input[key] === '')) {
        errors.push(`${key} is required.`);
      } else {
        // Check for filters, only apply if the field is provided
        if (input[key]) { // Only validate if the input field is provided
          if (rule.filter) {
            if (rule.filter === "FILTER_VALIDATE_INT" && isNaN(input[key])) {
              errors.push(`${key} must be a valid integer.`);
            }
            if (rule.filter === "FILTER_SANITIZE_SPECIAL_CHARS" && typeof input[key] === "string") {
              input[key] = input[key].replace(/[^a-zA-Z0-9 ]/g, ""); // Basic sanitization: remove special characters
            }
            if (rule.filter === "FILTER_VALIDATE_EMAIL" && !/\S+@\S+\.\S+/.test(input[key])) {
              errors.push(`${key} must be a valid email.`);
            }
          }
        }
      }
    }
  
    return { errors, sanitizedInput: input };
  };  

  export const validateComplaintInput = (input, rules) => {
    const errors = [];
    const sanitizedInput = {};
  
    // Check if input is valid
    if (!input || typeof input !== 'object') {
      errors.push('Input data is invalid.');
      return { errors, sanitizedInput: {} };
    }
  
    for (const [field, rule] of Object.entries(rules)) {
      const value = input[field];
  
      console.log(`Validating ${field}:`, value);
  
      // Check required fields
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required.`);
      } else {
        // Sanitize or assign normally
        if (value !== undefined && value !== null) {
          let sanitizedValue = value;
  
          // Basic sanitization
          if (typeof value === 'string') {
            sanitizedValue = value.trim(); // Remove extra spaces
          }
  
          sanitizedInput[field] = sanitizedValue;
        }
      }
    }
  
    return { errors, sanitizedInput };
  };  
  
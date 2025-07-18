// utils/phoneValidator.js
export const isValidIndianMobile = (phone) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Indian mobile numbers can be:
  // - 10 digits (without country code)
  // - 12 digits (with country code 91)
  // We'll accept both formats but convert to 10 digits for storage
  
  // Check if it's a 10 digit number starting with 6-9
  if (/^[6-9]\d{9}$/.test(cleaned)) {
    return cleaned; // return the 10 digit number
  }
  
  // Check if it's 12 digits starting with 91 followed by 6-9
  if (/^91[6-9]\d{9}$/.test(cleaned)) {
    return cleaned.slice(2); // return just the 10 digit number
  }
  
  return false;
};
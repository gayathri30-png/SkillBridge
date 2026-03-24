/**
 * Formats a numeric salary value into Indian Rupee (INR) format with LPA (Lakhs Per Annum) context.
 * @param {number|string} amount - The numeric amount in Rupees.
 * @returns {string} - Formatted string (e.g., "12 LPA" or "₹ 12,00,000").
 */
export const formatSalary = (amount) => {
  if (!amount || isNaN(amount)) return "Competitive";
  
  const num = Number(amount);
  if (num >= 100000) {
    const lpa = (num / 100000).toFixed(1);
    // If it's a whole number, remove the .0
    return `${lpa.endsWith('.0') ? lpa.slice(0, -2) : lpa} LPA`;
  }
  
  return `₹${num.toLocaleString('en-IN')}`;
};

/**
 * Formats a numeric value into standard Indian currency format.
 * @param {number|string} amount 
 * @returns {string}
 */
export const formatINR = (amount) => {
  if (!amount || isNaN(amount)) return "₹0";
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

/**
 * Formats a number to Indian Rupee currency string (e.g., ₹1,499 or ₹1,25,000)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats numbers in the Indian numbering system (Lakhs and Crores)
 */
export function formatIndianNumber(val: number): string {
  if (isNaN(val)) return '0';
  return new Intl.NumberFormat('en-IN').format(val);
}

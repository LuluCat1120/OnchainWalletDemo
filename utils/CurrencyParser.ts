/**
 * Calculate the total value by multiplying amount by rate
 */
export function calculateTotalValue(amount: number, rate: string): string {
  if (!amount || !rate || isNaN(amount) || isNaN(parseFloat(rate))) {
    return '0';
  }
  
  return (amount * parseFloat(rate)).toString();
}

/**
 * Format currency value with commas and two decimal places
 */
export function formatCurrencyValue(value: string): string {
  try {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return '0.00';
    }
    
    return numValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } catch (error) {
    return '0.00';
  }
} 
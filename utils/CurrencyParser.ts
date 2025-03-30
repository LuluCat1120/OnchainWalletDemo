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

/**
 * Format large numbers to abbreviated format with B (billion), M (million) or K (thousand)
 */
export function formatLargeNumber(value: string): string {
  try {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return '0.00';
    }
    
    if (numValue >= 1000000000) {
      return `${(numValue / 1000000000).toFixed(2)}B`;
    } else if (numValue >= 1000000) {
      return `${(numValue / 1000000).toFixed(2)}M`;
    } else if (numValue >= 1000) {
      return `${(numValue / 1000).toFixed(2)}K`;
    }
    
    return numValue.toFixed(2);
  } catch (error) {
    return '0.00';
  }
} 
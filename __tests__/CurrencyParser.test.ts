import { calculateTotalValue, formatCurrencyValue } from '../utils/CurrencyParser';

describe('CurrencyParser', () => {
  describe('calculateTotalValue', () => {
    it('should calculate total value correctly', () => {
      const amount = 2.5;
      const rate = '1000';
      
      const result = calculateTotalValue(amount, rate);
      
      expect(result).toBe('2500');
    });
    
    it('should return "0" for invalid inputs', () => {
      expect(calculateTotalValue(0, '1000')).toBe('0');
      expect(calculateTotalValue(100, '0')).toBe('0');
      expect(calculateTotalValue(100, '')).toBe('0');
      expect(calculateTotalValue(NaN, '1000')).toBe('0');
    });
  });
  
  describe('formatCurrencyValue', () => {
    it('should format currency values correctly', () => {
      expect(formatCurrencyValue('1000')).toBe('1,000.00');
      expect(formatCurrencyValue('1000000')).toBe('1,000,000.00');
      expect(formatCurrencyValue('1234.56')).toBe('1,234.56');
      expect(formatCurrencyValue('0.1')).toBe('0.10');
    });
    
    it('should return "0.00" for invalid inputs', () => {
      expect(formatCurrencyValue('')).toBe('0.00');
      expect(formatCurrencyValue('invalid')).toBe('0.00');
    });
  });
}); 
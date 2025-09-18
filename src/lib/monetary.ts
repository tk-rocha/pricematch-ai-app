/**
 * Utility functions for Brazilian currency formatting and parsing
 */

/**
 * Formats a number to Brazilian currency format (R$ 0,00)
 * @param value - Number to format
 * @returns Formatted currency string
 */
export function formatCurrency(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue);
}

/**
 * Formats currency input as user types (R$ 0,00 format)
 * @param value - Input string
 * @returns Formatted string with R$ prefix
 */
export function formatCurrencyInput(value: string): string {
  // Remove tudo exceto números
  const numbers = value.replace(/\D/g, '');
  
  if (!numbers) return '';
  
  // Converte para centavos
  const cents = parseInt(numbers);
  const reais = cents / 100;
  
  return reais.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Parses Brazilian currency string to decimal number
 * @param value - Currency string (e.g., "R$ 10,50" or "10,50")
 * @returns Decimal number
 */
export function parseCurrencyToDecimal(value: string): number {
  // Remove R$, espaços, pontos (milhares) e converte vírgula para ponto
  const cleanValue = value
    .replace(/R\$\s?/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.');
  
  return parseFloat(cleanValue) || 0;
}

/**
 * Handles currency input with automatic formatting
 * @param value - Input value
 * @param onChange - Callback function to update the value
 */
export function handleCurrencyInput(
  value: string,
  onChange: (value: string) => void
): void {
  // Remove tudo exceto números
  const numbers = value.replace(/\D/g, '');
  
  if (!numbers) {
    onChange('');
    return;
  }
  
  // Limita a 10 dígitos (R$ 99.999.999,99)
  if (numbers.length > 10) return;
  
  // Converte para centavos e formata
  const cents = parseInt(numbers);
  const reais = cents / 100;
  
  const formatted = reais.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  onChange(formatted);
}

/**
 * Formats a number to Brazilian currency display (without R$ symbol)
 * @param value - Number to format
 * @returns Formatted string with comma separator
 */
export function formatCurrencyDisplay(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Validates if a currency string is valid
 * @param value - Currency string to validate
 * @returns True if valid, false otherwise
 */
export function isValidCurrency(value: string): boolean {
  const cleanValue = value.replace(/R\$\s?/g, '');
  const pattern = /^\d{1,3}(\.\d{3})*,\d{2}$|^\d{1,6},\d{2}$/;
  return pattern.test(cleanValue);
}

/**
 * Converts cents to reais format
 * @param cents - Amount in cents
 * @returns Formatted currency string
 */
export function centsToReais(cents: number): string {
  const reais = cents / 100;
  return formatCurrencyDisplay(reais);
}

/**
 * Converts reais to cents
 * @param reais - Amount in reais (as number)
 * @returns Amount in cents
 */
export function reaisToCents(reais: number): number {
  return Math.round(reais * 100);
}
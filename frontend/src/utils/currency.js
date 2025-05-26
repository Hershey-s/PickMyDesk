// Currency utility functions

export const currencySymbols = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£'
};

export const currencyNames = {
  USD: 'US Dollar',
  INR: 'Indian Rupee',
  EUR: 'Euro',
  GBP: 'British Pound'
};

/**
 * Format price with currency symbol
 * @param {number} price - The price amount
 * @param {string} currency - Currency code (USD, INR, EUR, GBP)
 * @param {boolean} showCode - Whether to show currency code
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = 'INR', showCode = false) => {
  const symbol = currencySymbols[currency] || '₹';
  const formattedPrice = formatNumber(price, currency);
  
  if (showCode) {
    return `${symbol}${formattedPrice} ${currency}`;
  }
  
  return `${symbol}${formattedPrice}`;
};

/**
 * Format number according to currency locale
 * @param {number} number - The number to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted number
 */
export const formatNumber = (number, currency = 'INR') => {
  if (!number && number !== 0) return '0';
  
  // Indian number formatting (lakhs, crores)
  if (currency === 'INR') {
    return formatIndianNumber(number);
  }
  
  // International formatting
  return new Intl.NumberFormat('en-US').format(number);
};

/**
 * Format number in Indian style (lakhs, crores)
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatIndianNumber = (num) => {
  if (!num && num !== 0) return '0';
  
  const numStr = num.toString();
  
  // For numbers less than 1000, return as is
  if (num < 1000) {
    return numStr;
  }
  
  // For numbers 1000 and above, use Indian formatting
  const lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);
  
  if (otherNumbers !== '') {
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }
  
  return lastThree;
};

/**
 * Convert currency (basic conversion for demo)
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @returns {number} Converted amount
 */
export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  // Basic conversion rates (in real app, use live rates)
  const rates = {
    USD: { INR: 83, EUR: 0.85, GBP: 0.73 },
    INR: { USD: 0.012, EUR: 0.010, GBP: 0.009 },
    EUR: { USD: 1.18, INR: 98, GBP: 0.86 },
    GBP: { USD: 1.37, INR: 114, EUR: 1.16 }
  };
  
  if (fromCurrency === toCurrency) return amount;
  
  const rate = rates[fromCurrency]?.[toCurrency] || 1;
  return Math.round(amount * rate);
};

/**
 * Get currency info
 * @param {string} currency - Currency code
 * @returns {object} Currency information
 */
export const getCurrencyInfo = (currency = 'INR') => {
  return {
    code: currency,
    symbol: currencySymbols[currency] || '₹',
    name: currencyNames[currency] || 'Indian Rupee'
  };
};

/**
 * Format price range
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @param {string} currency - Currency code
 * @returns {string} Formatted price range
 */
export const formatPriceRange = (minPrice, maxPrice, currency = 'INR') => {
  if (minPrice === maxPrice) {
    return formatPrice(minPrice, currency);
  }
  
  return `${formatPrice(minPrice, currency)} - ${formatPrice(maxPrice, currency)}`;
};

export default {
  formatPrice,
  formatNumber,
  formatIndianNumber,
  convertCurrency,
  getCurrencyInfo,
  formatPriceRange,
  currencySymbols,
  currencyNames
};

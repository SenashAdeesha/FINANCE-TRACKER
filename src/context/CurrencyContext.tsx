import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyContextType {
  currency: string;
  setCurrency: (value: string) => void;
  exchangeRates: ExchangeRates;
  convertAmount: (amount: number, fromCurrency?: string) => number;
  formatCurrency: (amount: number, fromCurrency?: string) => string;
  getCurrencySymbol: (currencyCode: string) => string;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_SYMBOLS: { [key: string]: string } = {
  LKR: 'Rs.',
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<string>(() => {
    const saved = localStorage.getItem('currency');
    return saved || 'LKR';
  });

  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({
    LKR: 1,
    USD: 0.0031,
    EUR: 0.0028,
    GBP: 0.0024,
    INR: 0.26,
    JPY: 0.45,
    AUD: 0.0047,
    CAD: 0.0042,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Fetch exchange rates from API
  const fetchExchangeRates = async () => {
    try {
      setIsLoading(true);
      // Using exchangerate-api.com's free tier (no API key needed for basic usage)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/LKR');
      
      if (response.ok) {
        const data = await response.json();
        setExchangeRates(data.rates);
        localStorage.setItem('exchangeRates', JSON.stringify(data.rates));
        localStorage.setItem('exchangeRatesLastFetch', Date.now().toString());
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      // Use cached rates if available
      const cached = localStorage.getItem('exchangeRates');
      if (cached) {
        setExchangeRates(JSON.parse(cached));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if we need to fetch new rates (cache for 24 hours)
    const lastFetch = localStorage.getItem('exchangeRatesLastFetch');
    const oneDayInMs = 24 * 60 * 60 * 1000;
    
    if (!lastFetch || Date.now() - parseInt(lastFetch) > oneDayInMs) {
      fetchExchangeRates();
    } else {
      // Use cached rates
      const cached = localStorage.getItem('exchangeRates');
      if (cached) {
        setExchangeRates(JSON.parse(cached));
      }
    }
  }, []);

  const setCurrency = (value: string) => {
    setCurrencyState(value);
    localStorage.setItem('currency', value);
  };

  const convertAmount = (amount: number, fromCurrency: string = 'LKR'): number => {
    if (currency === fromCurrency) return amount;
    
    // Convert from base currency (LKR) to target currency
    if (fromCurrency === 'LKR') {
      return amount * (exchangeRates[currency] || 1);
    }
    
    // Convert from other currency to LKR first, then to target
    const amountInLKR = amount / (exchangeRates[fromCurrency] || 1);
    return amountInLKR * (exchangeRates[currency] || 1);
  };

  const getCurrencySymbol = (currencyCode: string): string => {
    return CURRENCY_SYMBOLS[currencyCode] || currencyCode;
  };

  const formatCurrency = (amount: number, fromCurrency: string = 'LKR'): string => {
    const convertedAmount = convertAmount(amount, fromCurrency);
    const symbol = getCurrencySymbol(currency);
    
    // Format with 2 decimal places for most currencies, 0 for JPY
    const decimals = currency === 'JPY' ? 0 : 2;
    
    return `${symbol} ${convertedAmount.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        exchangeRates,
        convertAmount,
        formatCurrency,
        getCurrencySymbol,
        isLoading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

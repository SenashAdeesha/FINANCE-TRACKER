import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface ThemeContextType {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  setDarkMode: (value: boolean) => void;
  setFontSize: (value: 'small' | 'medium' | 'large') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>(() => {
    const saved = localStorage.getItem('fontSize');
    return (saved as 'small' | 'medium' | 'large') || 'medium';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
    
    if (fontSize === 'small') {
      document.documentElement.classList.add('text-sm');
    } else if (fontSize === 'large') {
      document.documentElement.classList.add('text-lg');
    } else {
      document.documentElement.classList.add('text-base');
    }
  }, [fontSize]);

  return (
    <ThemeContext.Provider value={{ darkMode, fontSize, setDarkMode, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

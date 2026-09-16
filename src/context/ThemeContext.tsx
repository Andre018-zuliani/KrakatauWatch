import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light';

interface ThemeContextType {
  theme: 'light';
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Always enforce light mode across root and body
    root.classList.remove('dark');
    root.classList.add('light');
    body.classList.remove('dark');
    body.classList.add('light');
    body.style.backgroundColor = '#f1f5f9';
    body.style.color = '#0f172a';

    try {
      localStorage.removeItem('krakatau_theme');
    } catch {
      // ignore storage error
    }
  }, []);

  const toggleTheme = () => {
    // Mode gelap telah dihapus sesuai permintaan
  };

  const setTheme = () => {
    // Mode gelap telah dihapus sesuai permintaan
  };

  return (
    <ThemeContext.Provider value={{ theme: 'light', toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'light',
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
};

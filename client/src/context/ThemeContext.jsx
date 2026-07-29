import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Ensure dark class is removed from document element
    document.documentElement.classList.remove('dark');
  }, []);

  const toggleTheme = () => {
    // Locked to light theme
    setIsDark(false);
  };

  return (
    <ThemeContext.Provider value={{ isDark: false, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

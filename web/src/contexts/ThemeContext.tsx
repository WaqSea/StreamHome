import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'ember' | 'aurora' | 'cinema' | 'gemini';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('ember');

  useEffect(() => {
    // Dynamically load the theme CSS based on active theme
    const themeLink = document.getElementById('theme-style') as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = `/src/themes/${theme}.css`;
    } else {
      const link = document.createElement('link');
      link.id = 'theme-style';
      link.rel = 'stylesheet';
      link.href = `/src/themes/${theme}.css`;
      document.head.appendChild(link);
    }
    
    // Also set a data-theme attribute on body for tailwind or other dynamic checks
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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

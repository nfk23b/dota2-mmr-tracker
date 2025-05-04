import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useSettingsStore } from '../store/settings/settingsStore';

// Define the shape of our theme context
interface ThemeContextType {
  theme: 'light' | 'dark';
  isDarkMode: boolean;
  toggleTheme: () => void;
  updateTheme: (theme: 'light' | 'dark') => void;
}

// Create a context with a default value
const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  isDarkMode: true,
  toggleTheme: () => {},
  updateTheme: () => {},
});

// Export a hook for easy access to theme context
export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

// ThemeProvider component to wrap around the app
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get theme from settings store
  const theme = useSettingsStore(state => state.settings.theme);
  const updateThemeInStore = useSettingsStore(state => state.updateTheme);
  
  // Calculate if dark mode is active
  const isDarkMode = theme === 'dark';
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    updateThemeInStore(theme === 'dark' ? 'light' : 'dark');
  };
  
  // Update theme with specific value
  const updateTheme = (newTheme: 'light' | 'dark') => {
    updateThemeInStore(newTheme);
  };
  
  // Apply theme to document when it changes
  useEffect(() => {
    // First remove any theme class to start fresh
    document.documentElement.classList.remove('dark', 'light');
    
    // Apply appropriate class based on current theme
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('light');
    }
    
    // Set a data attribute for potential CSS targeting
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    
    // Store theme preference in localStorage for persistence across page reloads
    localStorage.setItem('theme', theme);
  }, [theme, isDarkMode]);
  
  // Provide theme context to all children
  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        isDarkMode, 
        toggleTheme, 
        updateTheme 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
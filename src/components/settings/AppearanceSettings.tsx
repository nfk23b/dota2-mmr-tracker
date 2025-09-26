import React from 'react';
import { useSettingsStore } from '../../store/settings/settingsStore';
import { AppSettings } from '../../features/settings/types';
import { useTheme } from '../../hooks/useTheme';

const AppearanceSettings: React.FC = () => {
  // Use our theme hook
  const { theme, updateTheme } = useTheme();
  
  // Get language settings from store
  const language = useSettingsStore(state => state.settings.language);
  const updateLanguage = useSettingsStore(state => state.updateLanguage);
  
  // Handle theme change
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTheme(e.target.value as AppSettings['theme']);
  };
  
  // Handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateLanguage(e.target.value as AppSettings['language']);
  };
  
  // Create theme preview cards
  const ThemePreview = ({ themeName, active }: { themeName: string; active: boolean }) => {
    return (
      <div 
        className={`rounded-md border overflow-hidden ${active ? 'ring-2 ring-blue-500' : 'border-gray-300 dark:border-gray-600'}`}
      >
        <div className="text-center py-1 bg-gray-100 dark:bg-gray-700 font-medium">
          {themeName}
        </div>
        <div className={`flex h-16 ${themeName.toLowerCase() === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`w-1/3 p-2 ${themeName.toLowerCase() === 'dark' ? 'text-white' : 'text-black'}`}>
            <div className="h-2 w-12 mb-1 rounded-full bg-blue-500"></div>
            <div className="h-2 w-8 rounded-full bg-gray-400"></div>
          </div>
          <div className={`w-2/3 border-l ${themeName.toLowerCase() === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`h-4 w-16 m-2 rounded ${themeName.toLowerCase() === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Appearance Settings</h2>
      
      {/* Visual theme selection */}
      <div className="space-y-2">
        <label className="block font-medium">
          Theme
        </label>
        <div className="grid grid-cols-3 gap-4">
          {/* <div className="space-y-2">
            <ThemePreview themeName="Light" active={theme === 'light'} />
            <button 
              onClick={() => updateTheme('light')}
              className={`w-full p-1 rounded-md ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white'}`}
            >
              Light
            </button>
          </div> */}
          <div className="space-y-2">
            <ThemePreview themeName="Dark" active={theme === 'dark'} />
            <button 
              onClick={() => updateTheme('dark')}
              className={`w-full p-1 rounded-md ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white'}`}
            >
              Dark
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Choose your preferred theme for the application
        </p>
      </div>
      
      {/* Language settings */}
      <div className="space-y-2">
        <label htmlFor="language" className="block font-medium">
          Language
        </label>
        <select
          id="language"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-800 bg-white dark:text-white dark:bg-gray-800 dark:border-gray-600"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="en">English</option>
          {/* <option value="ru">Russian</option> */}
        </select>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Select your preferred language
        </p>
      </div>
      
      <div className="p-4 bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-md">
        <p className="text-sm">
          <strong>Note:</strong> Language settings will be fully implemented in future versions.
          Currently, only the UI language is affected.
        </p>
      </div>
    </div>
  );
};

export default AppearanceSettings;
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings, defaultSettings } from '../../features/settings/types';

interface SettingsState {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  updateTheme: (theme: AppSettings['theme']) => void;
  updateLanguage: (language: AppSettings['language']) => void;
  updateMmr: (mmr: number) => void;
  updateInitialMmr: (mmr: number) => void;
  updateChartSettings: (period: AppSettings['defaultChartPeriod'], showTrendline: boolean) => void;
  updateBackupSettings: (autoBackup: boolean, frequency: AppSettings['backupFrequency']) => void;
  updateReminderSettings: (show: boolean, frequency: number) => void;
  addFavoriteHero: (hero: string) => void;
  removeFavoriteHero: (hero: string) => void;
  toggleDebugMode: () => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      
      // Update entire settings object or parts of it
      updateSettings: (newSettings) => 
        set((state) => ({ 
          settings: { ...state.settings, ...newSettings } 
        })),
      
      // Theme settings
      updateTheme: (theme) => 
        set((state) => ({ 
          settings: { ...state.settings, theme } 
        })),
      
      // Language settings
      updateLanguage: (language) => 
        set((state) => ({ 
          settings: { ...state.settings, language } 
        })),
      
      // MMR settings
      updateMmr: (mmr) => 
        set((state) => ({ 
          settings: { ...state.settings, currentMmr: mmr } 
        })),
      
      updateInitialMmr: (mmr) => 
        set((state) => ({ 
          settings: { ...state.settings, initialMmr: mmr } 
        })),
      
      // Chart settings
      updateChartSettings: (defaultChartPeriod, showMmrTrendline) => 
        set((state) => ({ 
          settings: { ...state.settings, defaultChartPeriod, showMmrTrendline } 
        })),
      
      // Backup settings
      updateBackupSettings: (autoBackup, backupFrequency) => 
        set((state) => ({ 
          settings: { ...state.settings, autoBackup, backupFrequency } 
        })),
      
      // Reminder settings
      updateReminderSettings: (showMatchReminders, reminderFrequency) => 
        set((state) => ({ 
          settings: { ...state.settings, showMatchReminders, reminderFrequency } 
        })),
      
      // Favorite heroes
      addFavoriteHero: (hero) => 
        set((state) => ({
          settings: { 
            ...state.settings, 
            favoriteHeroes: [...state.settings.favoriteHeroes, hero] 
          }
        })),
      
      removeFavoriteHero: (hero) => 
        set((state) => ({
          settings: { 
            ...state.settings, 
            favoriteHeroes: state.settings.favoriteHeroes.filter(h => h !== hero) 
          }
        })),
      
      // Debug mode
      toggleDebugMode: () => 
        set((state) => ({ 
          settings: { 
            ...state.settings, 
            debugMode: !state.settings.debugMode 
          } 
        })),
      
      // Reset to defaults
      resetSettings: () => 
        set({ settings: defaultSettings }),
    }),
    {
      name: 'dota-mmr-tracker-settings',
      // Only store the settings object, not the methods
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);
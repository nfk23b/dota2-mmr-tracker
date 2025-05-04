export interface AppSettings {
    // Display settings
    theme: 'light' | 'dark';
    language: 'en' | 'ru';
    
    // MMR settings
    initialMmr: number;
    currentMmr: number;
    
    // Chart settings
    defaultChartPeriod: 'day' | 'week' | 'month' | 'quarter' | 'all';
    showMmrTrendline: boolean;
    
    // Data settings
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
    
    // Notification settings
    showMatchReminders: boolean;
    reminderFrequency: number; // In hours
    
    // Hero settings
    favoriteHeroes: string[];
    
    // Advanced settings
    debugMode: boolean;
  }
  
  // Default settings
  export const defaultSettings: AppSettings = {
    theme: 'dark',
    language: 'en',
    initialMmr: 1500,
    currentMmr: 1500,
    defaultChartPeriod: 'month',
    showMmrTrendline: true,
    autoBackup: true,
    backupFrequency: 'weekly',
    showMatchReminders: false,
    reminderFrequency: 24,
    favoriteHeroes: [],
    debugMode: false,
  };
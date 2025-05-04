// Utility for initializing and synchronizing settings
import { useMatchesStore } from '../store/matches/matchesStore';
import { useSettingsStore } from '../store/settings/settingsStore';

/**
 * Initializes settings and synchronizes data between stores
 * Call this function when the application loads
 */
export const initializeSettings = (): void => {
  // Get current values from both stores
  const matchesMMR = useMatchesStore.getState().currentMMR;
  const settingsMmr = useSettingsStore.getState().settings.currentMmr;
  const initialMmr = useSettingsStore.getState().settings.initialMmr;
  
  // Get update functions from both stores
  const updateSettingsMmr = useSettingsStore.getState().updateMmr;
  const updateInitialMmr = useSettingsStore.getState().updateInitialMmr;
  const setMatchesMMR = useMatchesStore.getState().setCurrentMMR;
  
  // Synchronize MMR between stores
  if (matchesMMR !== 0 && settingsMmr === 3000) {
    // If MMR is set in matches store but not in settings (default value is 3000),
    // use value from matches store
    updateSettingsMmr(matchesMMR);
    
    // If initial MMR is not set, set it to current value
    if (initialMmr === 3000) {
      updateInitialMmr(matchesMMR);
    }
  } else if (matchesMMR === 0 && settingsMmr !== 3000) {
    // If MMR is set in settings but not in matches,
    // use value from settings
    setMatchesMMR(settingsMmr);
  }
  
  // Setup theme
  const theme = useSettingsStore.getState().settings.theme;
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};
import React, { useState } from 'react';
import { useSettingsStore } from '../../store/settings/settingsStore';
import { AppSettings } from '../../features/settings/types';

const BackupSettings: React.FC = () => {
  const autoBackup = useSettingsStore(state => state.settings.autoBackup);
  const backupFrequency = useSettingsStore(state => state.settings.backupFrequency);
  const updateBackupSettings = useSettingsStore(state => state.updateBackupSettings);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  
  // Handle auto backup toggle
  const handleAutoBackupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateBackupSettings(e.target.checked, backupFrequency);
  };
  
  // Handle backup frequency change
  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateBackupSettings(
      autoBackup,
      e.target.value as AppSettings['backupFrequency']
    );
  };
  
  // Export data as JSON
  const handleExportData = () => {
    try {
      // Get all stored data
      const matchesData = localStorage.getItem('dota-mmr-tracker-matches');
      const settingsData = localStorage.getItem('dota-mmr-tracker-settings');
      
      // Create an object with all data
      const exportData = {
        matches: matchesData ? JSON.parse(matchesData) : {},
        settings: settingsData ? JSON.parse(settingsData) : {},
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      };
      
      // Convert to JSON string
      const jsonString = JSON.stringify(exportData, null, 2);
      
      // Create a download blob
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a download link and trigger it
      const a = document.createElement('a');
      a.href = url;
      a.download = `dota-mmr-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    }
  };
  
  // Import data from JSON file
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(null);
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string);
        
        // Validate the imported data structure
        if (!jsonData.matches || !jsonData.settings || !jsonData.version) {
          throw new Error('Invalid backup file format');
        }
        
        // Confirm before overwriting data
        if (
          window.confirm(
            'This will replace all your current data. Are you sure you want to proceed?'
          )
        ) {
          // Save imported data to localStorage
          localStorage.setItem(
            'dota-mmr-tracker-matches',
            JSON.stringify(jsonData.matches)
          );
          localStorage.setItem(
            'dota-mmr-tracker-settings',
            JSON.stringify(jsonData.settings)
          );
          
          setImportSuccess('Data imported successfully! Refreshing page...');
          
          // Refresh the page to apply changes
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } catch (error) {
        console.error('Error importing data:', error);
        setImportError('Invalid backup file. Please select a valid backup file.');
      }
    };
    
    reader.onerror = () => {
      setImportError('Error reading file. Please try again.');
    };
    
    reader.readAsText(file);
    
    // Clear the input value to allow selecting the same file again
    e.target.value = '';
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Backup Settings</h2>
      
      {/* Auto Backup Settings */}
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            id="autoBackup"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={autoBackup}
            onChange={handleAutoBackupChange}
          />
          <label htmlFor="autoBackup" className="ml-2 block font-medium">
            Enable Automatic Backups
          </label>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Automatically save a backup of your data
        </p>
      </div>
      
      {/* Backup Frequency */}
      <div className="space-y-2">
        <label htmlFor="backupFrequency" className="block font-medium">
          Backup Frequency
        </label>
        <select
          id="backupFrequency"
          className="w-full p-2 bw-full p-2 border border-gray-700 rounded-md shadow-sm text-white bg-gray-800 dark:border-gray-600"
          value={backupFrequency}
          onChange={handleFrequencyChange}
          disabled={!autoBackup}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="never">Never</option>
        </select>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          How often to create automatic backups
        </p>
      </div>
      
      {/* Manual Backup & Restore */}
      <div className="p-4 w-full p-2 border border-gray-700 rounded-md shadow-sm text-white bg-gray-800 dark:border-gray-600">
        <h3 className="font-medium mb-4">Manual Backup & Restore</h3>
        
        {/* Export Button */}
        <div className="mb-4">
          <button
            onClick={handleExportData}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Export Data
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Download a backup of all your data
          </p>
        </div>
        
        {/* Import Button */}
        <div>
          <label
            htmlFor="importFile"
            className="block w-full bg-gray-100 text-center text-gray-800 p-2 rounded-md hover:bg-gray-200 cursor-pointer dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Import Data
          </label>
          <input
            id="importFile"
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportData}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Restore your data from a backup file
          </p>
          
          {importError && (
            <p className="text-sm text-red-500 mt-2">{importError}</p>
          )}
          
          {importSuccess && (
            <p className="text-sm text-green-500 mt-2">{importSuccess}</p>
          )}
        </div>
      </div>
      
      {/* Info box */}
      <div className="p-4 bg-yellow-50 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-md">
        <p className="text-sm">
          <strong>Note:</strong> Currently, backups are stored locally in your browser.
          Cloud backup functionality will be available in future updates.
        </p>
      </div>
    </div>
  );
};

export default BackupSettings;
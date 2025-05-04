import React, { useState } from 'react';
import { useSettingsStore } from '../../store/settings/settingsStore';

const AdvancedSettings: React.FC = () => {
  const debugMode = useSettingsStore(state => state.settings.debugMode);
  const toggleDebugMode = useSettingsStore(state => state.toggleDebugMode);
  
  const [showDangerZone, setShowDangerZone] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  
  // Toggle debug mode
  const handleDebugModeToggle = () => {
    toggleDebugMode();
  };
  
  // Handle clearing all data
  const handleClearAllData = () => {
    if (deleteConfirmation !== 'DELETE') {
      alert('Please type DELETE to confirm');
      return;
    }
    
    // Clear all data from localStorage
    if (
      window.confirm(
        'This will permanently delete ALL your data. This action CANNOT be undone. Are you absolutely sure?'
      )
    ) {
      localStorage.clear();
      alert('All data has been cleared. The page will now reload.');
      window.location.reload();
    }
  };
  
  // Toggle danger zone visibility
  const toggleDangerZone = () => {
    setShowDangerZone(!showDangerZone);
    setDeleteConfirmation('');
  };
  
  // Calculate storage usage
  const calculateStorageUsage = () => {
    let totalSize = 0;
    
    // Calculate size of all localStorage items
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        totalSize += key.length + value.length;
      }
    }
    
    // Convert to kilobytes
    return (totalSize / 1024).toFixed(2);
  };
  
  // Handle export debug data
  const handleExportDebugData = () => {
    try {
      // Get all localStorage data
      const debugData: Record<string, any> = {};
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          try {
            const value = localStorage.getItem(key);
            if (value) {
              debugData[key] = JSON.parse(value);
            }
          } catch (e) {
            const value = localStorage.getItem(key);
            debugData[key] = value;
          }
        }
      }
      
      // Add system info
      debugData['_systemInfo'] = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        timestamp: new Date().toISOString(),
        appVersion: '1.0.0', // Replace with your app version
      };
      
      // Convert to JSON and download
      const jsonString = JSON.stringify(debugData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `dota-mmr-tracker-debug-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error exporting debug data:', error);
      alert('Failed to export debug data. Please try again.');
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Advanced Settings</h2>
      
      {/* Debug Mode Toggle */}
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            id="debugMode"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={debugMode}
            onChange={handleDebugModeToggle}
          />
          <label htmlFor="debugMode" className="ml-2 block font-medium">
            Enable Debug Mode
          </label>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Show additional debugging information and tools
        </p>
      </div>
      
      {/* Storage Info */}
      <div className="p-4 w-full p-2 border border-gray-700 rounded-md shadow-sm text-white bg-gray-800 dark:border-gray-600">
        <h3 className="font-medium mb-2">Storage Information</h3>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Local Storage Usage:</span>{' '}
            {calculateStorageUsage()} KB
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Browser storage is limited to about 5MB per domain
          </p>
          
          <button
            onClick={handleExportDebugData}
            className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Export Debug Data
          </button>
        </div>
      </div>
      
      {/* Developer Tools (only visible in debug mode) */}
      {debugMode && (
        <div className="p-4 w-full p-2 border border-gray-700 rounded-md shadow-sm text-white bg-gray-800 dark:border-gray-600">
          <h3 className="font-medium mb-2">Developer Tools</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              These tools are for development and debugging purposes only
            </p>
            
            <div className="flex space-x-2">
              <button
                onClick={() => console.log('All localStorage:', localStorage)}
                className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Log Storage to Console
              </button>
              
              <button
                onClick={() => console.log('Application State:', useSettingsStore.getState())}
                className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Log State to Console
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Danger Zone */}
      <div className="mt-8">
        <button
          onClick={toggleDangerZone}
          className="flex items-center text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
        >
          <svg
            className="h-5 w-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          Danger Zone {showDangerZone ? '(hide)' : '(show)'}
        </button>
        
        {showDangerZone && (
          <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-md dark:bg-red-900 dark:border-red-700">
            <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">
              Danger Zone - Use with caution
            </h3>
            
            <div className="space-y-4">
              <p className="text-sm text-red-600 dark:text-red-300">
                The following actions are destructive and cannot be undone.
              </p>
              
              <div className="space-y-2">
                <p className="font-medium text-red-800 dark:text-red-200">
                  Clear All Data
                </p>
                <p className="text-sm text-red-600 dark:text-red-300">
                  This will permanently delete all your data, including settings, matches, and statistics.
                </p>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type DELETE to confirm"
                    className="w-1/2 p-2 border border-red-300 rounded-md rounded-md shadow-sm text-black "
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                  />
                  <button
                    onClick={handleClearAllData}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    disabled={deleteConfirmation !== 'DELETE'}
                  >
                    Clear All Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedSettings;
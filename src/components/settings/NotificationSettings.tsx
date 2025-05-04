import React, { useState } from 'react';
import { useSettingsStore } from '../../store/settings/settingsStore';

const NotificationSettings: React.FC = () => {
  const showMatchReminders = useSettingsStore(state => state.settings.showMatchReminders);
  const reminderFrequency = useSettingsStore(state => state.settings.reminderFrequency);
  const updateReminderSettings = useSettingsStore(state => state.updateReminderSettings);
  
  const [permissionStatus, setPermissionStatus] = useState<string>(() => {
    // Check if Notification API is available
    if (typeof Notification !== 'undefined') {
      return Notification.permission;
    }
    return 'unsupported';
  });
  
  // Handle reminder toggle
  const handleReminderToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateReminderSettings(e.target.checked, reminderFrequency);
  };
  
  // Handle frequency change
  const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      updateReminderSettings(showMatchReminders, value);
    }
  };
  
  // Request notification permission
  const requestPermission = async () => {
    if (typeof Notification !== 'undefined') {
      try {
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  };
  
  // Test notification
  const sendTestNotification = () => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      // Create notification
      const notification = new Notification('Dota MMR Tracker', {
        body: 'This is a test notification. Time to track your next match!',
        icon: '/favicon.ico', // Replace with your app's icon
      });
      
      // Close notification after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);
    } else {
      alert('Notification permission not granted. Please enable notifications first.');
    }
  };
  
  // Check if notifications are supported
  const isNotificationSupported = typeof Notification !== 'undefined';
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Notification Settings</h2>
      
      {!isNotificationSupported && (
        <div className="p-4 bg-yellow-50 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-md">
          <p className="text-sm">
            <strong>Note:</strong> Notifications are not supported in your browser.
          </p>
        </div>
      )}
      
      {/* Permission status */}
      {isNotificationSupported && (
        <div className="space-y-2">
          <p className="font-medium">Notification Permission:</p>
          <div className="flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                permissionStatus === 'granted'
                  ? 'bg-green-500'
                  : permissionStatus === 'denied'
                  ? 'bg-red-500'
                  : 'bg-yellow-500'
              }`}
            ></span>
            <span>
              {permissionStatus === 'granted'
                ? 'Enabled'
                : permissionStatus === 'denied'
                ? 'Blocked'
                : 'Not requested'}
            </span>
            
            {permissionStatus !== 'granted' && (
              <button
                onClick={requestPermission}
                className="ml-4 px-3 py-1 bg-blue-500 text-white text-sm rounded-md"
                disabled={permissionStatus === 'denied'}
              >
                {permissionStatus === 'denied'
                  ? 'Blocked in Browser Settings'
                  : 'Enable Notifications'}
              </button>
            )}
            
            {permissionStatus === 'granted' && (
              <button
                onClick={sendTestNotification}
                className="ml-4 px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-md dark:bg-gray-700 dark:text-gray-200"
              >
                Test Notification
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Match Reminders */}
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            id="matchReminders"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={showMatchReminders}
            onChange={handleReminderToggle}
            disabled={!isNotificationSupported || permissionStatus !== 'granted'}
          />
          <label htmlFor="matchReminders" className="ml-2 block font-medium">
            Enable Match Reminders
          </label>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Get reminded to record your match results
        </p>
      </div>
      
      {/* Reminder Frequency */}
      <div className="space-y-2">
        <label htmlFor="reminderFrequency" className="block font-medium">
          Reminder Frequency (hours)
        </label>
        <input
          id="reminderFrequency"
          type="number"
          min="1"
          max="168"
          className="w-full p-2 w-full p-2 border border-gray-700 rounded-md shadow-sm text-white bg-gray-800 dark:border-gray-600"
          value={reminderFrequency}
          onChange={handleFrequencyChange}
          disabled={!showMatchReminders || !isNotificationSupported || permissionStatus !== 'granted'}
        />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          How often to remind you to record your matches (in hours)
        </p>
      </div>
      
      {/* Info box */}
      <div className="p-4 bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-md">
        <p className="text-sm">
          <strong>Coming Soon:</strong> Custom notification schedules and integration with 
          the Dota 2 game client to automatically detect when you've played a match.
        </p>
      </div>
    </div>
  );
};

export default NotificationSettings;
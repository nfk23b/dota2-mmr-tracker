import React, { useState } from 'react';
import { useSettingsStore } from '../../store/settings/settingsStore';
import AppearanceSettings from './AppearanceSettings';
import MmrSettings from './MmrSettings';
import ChartSettings from './ChartSettings';
import BackupSettings from './BackupSettings';
import NotificationSettings from './NotificationSettings';
import HeroSettings from './HeroSettings';
import AdvancedSettings from './AdvancedSettings';

// Tab type definition
type SettingsTab = 
  | 'appearance' 
  | 'mmr' 
  | 'charts' 
  | 'backup' 
  | 'notifications' 
  | 'heroes' 
  | 'advanced';

const Settings: React.FC = () => {
  // Current active tab
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');
  
  // Get settings from store
  const settings = useSettingsStore(state => state.settings);
  const resetSettings = useSettingsStore(state => state.resetSettings);
  
  // Tab configuration
  const tabs: { id: SettingsTab; label: string }[] = [
    { id: 'appearance', label: 'Appearance' },
    { id: 'mmr', label: 'MMR' },
    { id: 'charts', label: 'Charts' },
    { id: 'backup', label: 'Backup' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'heroes', label: 'Heroes' },
    { id: 'advanced', label: 'Advanced' },
  ];
  
  // Handle tab change
  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
  };
  
  // Handle reset settings
  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      resetSettings();
    }
  };
  
  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance':
        return <AppearanceSettings />;
      case 'mmr':
        return <MmrSettings />;
      case 'charts':
        return <ChartSettings />;
      case 'backup':
        return <BackupSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'heroes':
        return <HeroSettings />;
      case 'advanced':
        return <AdvancedSettings />;
      default:
        return <div>Select a tab</div>;
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {/* Tabs navigation */}
      <div className="flex flex-wrap mb-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 mr-2 ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-600 hover:text-blue-500'
            }`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab content */}
      <div className="mb-6">{renderTabContent()}</div>
      
      {/* Actions */}
      <div className="flex justify-between mt-8">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleResetSettings}
        >
          Reset All Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
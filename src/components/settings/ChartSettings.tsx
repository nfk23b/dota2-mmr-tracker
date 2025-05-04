import React from 'react';
import { useSettingsStore } from '../../store/settings/settingsStore';
import { AppSettings } from '../../features/settings/types';

const ChartSettings: React.FC = () => {
  const defaultChartPeriod = useSettingsStore(state => state.settings.defaultChartPeriod);
  const showMmrTrendline = useSettingsStore(state => state.settings.showMmrTrendline);
  const updateChartSettings = useSettingsStore(state => state.updateChartSettings);
  
  // Handle period change
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateChartSettings(
      e.target.value as AppSettings['defaultChartPeriod'],
      showMmrTrendline
    );
  };
  
  // Handle trendline toggle change
  const handleTrendlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateChartSettings(defaultChartPeriod, e.target.checked);
  };
  
  // Chart period options with labels
  const chartPeriods = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'Last 7 days' },
    { value: 'month', label: 'Last 30 days' },
    { value: 'quarter', label: 'Last 90 days' },
    { value: 'all', label: 'All time' },
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Chart Settings</h2>
      
      {/* Default chart period */}
      <div className="space-y-2">
        <label htmlFor="chartPeriod" className="block font-medium">
          Default Chart Period
        </label>
        <select
          id="chartPeriod"
          className="w-full p-2 w-full p-2 border border-gray-700 rounded-md shadow-sm text-white bg-gray-800 dark:border-gray-600"
          value={defaultChartPeriod}
          onChange={handlePeriodChange}
        >
          {chartPeriods.map((period) => (
            <option key={period.value} value={period.value}>
              {period.label}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Default time period to display on the MMR chart
        </p>
      </div>
      
      {/* Trendline toggle */}
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            id="trendline"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={showMmrTrendline}
            onChange={handleTrendlineChange}
          />
          <label htmlFor="trendline" className="ml-2 block font-medium">
            Show MMR Trendline
          </label>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Display a trend line on the MMR chart to visualize your overall progress
        </p>
      </div>
      
      {/* Chart preview */}
      <div className="p-4 w-full p-2 border border-gray-700 rounded-md shadow-sm text-white bg-gray-800 dark:border-gray-600">
        <h3 className="font-medium mb-2">Chart Preview</h3>
        <div className="bg-gray-100 dark:bg-gray-800 h-40 rounded-md flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            Chart preview will be available in future updates
          </p>
        </div>
      </div>
      
      {/* Additional chart settings info */}
      <div className="p-4 bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-md">
        <p className="text-sm">
          <strong>Tip:</strong> Additional chart customization options will be
          available in future updates, including custom colors, annotations, and 
          multiple data visualization types.
        </p>
      </div>
    </div>
  );
};

export default ChartSettings;
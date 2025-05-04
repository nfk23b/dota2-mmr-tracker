import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../../store/settings/settingsStore';
import { useMatchesStore } from '../../store/matches/matchesStore';

const MmrSettings: React.FC = () => {
  const currentMmr = useSettingsStore(state => state.settings.currentMmr);
  const initialMmr = useSettingsStore(state => state.settings.initialMmr);
  const updateMmr = useSettingsStore(state => state.updateMmr);
  const updateInitialMmr = useSettingsStore(state => state.updateInitialMmr);
  
  // Получаем доступ к хранилищу матчей для синхронизации
  const matchesCurrentMMR = useMatchesStore(state => state.currentMMR);
  const setMatchesCurrentMMR = useMatchesStore(state => state.setCurrentMMR);
  
  const [tempCurrentMmr, setTempCurrentMmr] = useState(currentMmr.toString());
  const [tempInitialMmr, setTempInitialMmr] = useState(initialMmr.toString());
  const [currentMmrError, setCurrentMmrError] = useState<string | null>(null);
  const [initialMmrError, setInitialMmrError] = useState<string | null>(null);
  
  // Синхронизируем значения при монтировании компонента
  useEffect(() => {
    // Если значения MMR различаются, приоритет у matchesStore
    if (currentMmr !== matchesCurrentMMR) {
      setTempCurrentMmr(matchesCurrentMMR.toString());
    }
  }, [currentMmr, matchesCurrentMMR]);
  
  // Handle current MMR change
  const handleCurrentMmrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTempCurrentMmr(value);
    
    // Validate input
    if (!/^\d*$/.test(value)) {
      setCurrentMmrError('Please enter a valid number');
      return;
    }
    
    setCurrentMmrError(null);
  };
  
  // Handle initial MMR change
  const handleInitialMmrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTempInitialMmr(value);
    
    // Validate input
    if (!/^\d*$/.test(value)) {
      setInitialMmrError('Please enter a valid number');
      return;
    }
    
    setInitialMmrError(null);
  };
  
  // Save current MMR
  const saveCurrentMmr = () => {
    if (currentMmrError) return;
    
    const mmrValue = parseInt(tempCurrentMmr);
    if (isNaN(mmrValue)) {
      setCurrentMmrError('Please enter a valid number');
      return;
    }
    
    // Обновляем MMR в обоих хранилищах
    updateMmr(mmrValue);
    setMatchesCurrentMMR(mmrValue);
  };
  
  // Save initial MMR
  const saveInitialMmr = () => {
    if (initialMmrError) return;
    
    const mmrValue = parseInt(tempInitialMmr);
    if (isNaN(mmrValue)) {
      setInitialMmrError('Please enter a valid number');
      return;
    }
    
    updateInitialMmr(mmrValue);
  };
  
  // Handle blur events to save values
  const handleCurrentMmrBlur = () => {
    saveCurrentMmr();
  };
  
  const handleInitialMmrBlur = () => {
    saveInitialMmr();
  };
  
  // Handle key press for Enter key
  const handleKeyPress = (e: React.KeyboardEvent, saveFunction: () => void) => {
    if (e.key === 'Enter') {
      saveFunction();
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">MMR Settings</h2>
      
      {/* Current MMR */}
      <div className="space-y-2">
        <label htmlFor="currentMmr" className="block font-medium">
          Current MMR
        </label>
        <div className="flex">
          <input
            id="currentMmr"
            type="text"
            className={`w-full p-2 border rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 ${
              currentMmrError ? 'border-red-500' : 'border-gray-300'
            }`}
            value={tempCurrentMmr}
            onChange={handleCurrentMmrChange}
            onBlur={handleCurrentMmrBlur}
            onKeyPress={(e) => handleKeyPress(e, saveCurrentMmr)}
          />
          <button
            onClick={saveCurrentMmr}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Save
          </button>
        </div>
        {currentMmrError && (
          <p className="text-sm text-red-500">{currentMmrError}</p>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your current MMR value
        </p>
      </div>
      
      {/* Initial MMR */}
      <div className="space-y-2">
        <label htmlFor="initialMmr" className="block font-medium">
          Initial MMR
        </label>
        <div className="flex">
          <input
            id="initialMmr"
            type="text"
            className={`w-full p-2 border rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 ${
              initialMmrError ? 'border-red-500' : 'border-gray-300'
            }`}
            value={tempInitialMmr}
            onChange={handleInitialMmrChange}
            onBlur={handleInitialMmrBlur}
            onKeyPress={(e) => handleKeyPress(e, saveInitialMmr)}
          />
          <button
            onClick={saveInitialMmr}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Save
          </button>
        </div>
        {initialMmrError && (
          <p className="text-sm text-red-500">{initialMmrError}</p>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your starting MMR when you began tracking
        </p>
      </div>
      
      {/* MMR Progress */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
        <h3 className="font-medium mb-2">MMR Progress</h3>
        <div className="flex justify-between">
          <span>Initial: {initialMmr}</span>
          <span>Current: {matchesCurrentMMR}</span>
          <span>
            Difference:{' '}
            <span
              className={
                matchesCurrentMMR - initialMmr > 0
                  ? 'text-green-500'
                  : matchesCurrentMMR - initialMmr < 0
                  ? 'text-red-500'
                  : ''
              }
            >
              {matchesCurrentMMR - initialMmr > 0 ? '+' : ''}
              {matchesCurrentMMR - initialMmr}
            </span>
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 dark:bg-gray-700">
          <div
            className={`h-2.5 rounded-full ${
              matchesCurrentMMR - initialMmr >= 0 ? 'bg-green-600' : 'bg-red-600'
            }`}
            style={{
              width: `${Math.min(
                Math.abs((matchesCurrentMMR - initialMmr) / (initialMmr * 0.1)) * 100,
                100
              )}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MmrSettings;
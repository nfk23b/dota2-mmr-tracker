import React, { useState } from 'react';

interface WelcomeModalProps {
  onSubmit: (mmr: number) => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onSubmit }) => {
  const [mmr, setMmr] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const mmrNumber = Number(mmr);
    if (!mmr.trim() || isNaN(mmrNumber)) {
      setError('Please enter a valid MMR value');
      return;
    }
    
    onSubmit(mmrNumber);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 border border-gray-700 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-dota-red mb-2">Welcome to Dota 2 MMR Tracker</h2>
          <p className="text-gray-300">Let's start by setting your current MMR</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Your current MMR</label>
            <input
              type="number"
              value={mmr}
              onChange={(e) => {
                setMmr(e.target.value);
                setError('');
              }}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-dota-red"
              placeholder="Enter your MMR"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
          
          <button
            type="submit"
            className="w-full bg-dota-red hover:bg-red-600 text-white font-bold py-3 px-4 rounded-md transition-colors shadow-lg"
          >
            Start Tracking
          </button>
          
          <p className="text-xs text-gray-400 text-center mt-4">
            You can always update your MMR later by clicking on it in the header
          </p>
        </form>
      </div>
    </div>
  );
};

export default WelcomeModal;
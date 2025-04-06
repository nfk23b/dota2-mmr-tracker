import React, { useEffect, useState } from 'react';
import Layout from './components/layout/Layout';
import MatchForm from './components/matches/MatchForm';
import MatchList from './components/matches/MatchList';
import { useMatchesStore } from './store/matches/matchesStore';

function App() {
  const setCurrentMMR = useMatchesStore(state => state.setCurrentMMR);
  const matches = useMatchesStore(state => state.matches);
  const [showTips, setShowTips] = useState(true);
  
  // Initialize MMR if not set
  useEffect(() => {
    const storedMMR = useMatchesStore.getState().currentMMR;
    
    if (storedMMR === 0) {
      const initialMMR = window.prompt('Welcome! Please enter your current MMR:');
      if (initialMMR !== null && !isNaN(Number(initialMMR))) {
        setCurrentMMR(Number(initialMMR));
      }
    }
  }, [setCurrentMMR]);

  return (
    <Layout>
      {/* Tips banner for new users */}
      {showTips && matches.length === 0 && (
        <div className="bg-gray-700 rounded-lg p-4 mb-8 relative">
          <button 
            onClick={() => setShowTips(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <h3 className="text-lg font-bold text-dota-red mb-2">Getting Started</h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-300">
            <li>Add your matches using the form on the left</li>
            <li>Your current MMR will automatically update</li>
            <li>You can edit your MMR anytime by clicking on it in the header</li>
            <li>Track your progress over time with detailed stats</li>
          </ul>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="lg:sticky lg:top-4">
            <MatchForm />
          </div>
        </div>
        <div className="lg:col-span-2 order-1 lg:order-2">
          <MatchList />
        </div>
      </div>
    </Layout>
  );
}

export default App;
import React, { useState } from 'react';
import { Match } from '../../features/matches/types';
import { format } from 'date-fns';
import { HeroIcon } from '../ui/HeroIcon';
import { 
  GAME_DIFFICULTY_LABELS, 
  ROLE_LABELS, 
  MOODS, 
  GAME_RESULT_LABELS 
} from '../../features/matches/constants';

interface MatchCardProps {
  match: Match;
  onDelete: (id: string) => void;
  onEdit: (match: Match) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onDelete, onEdit  }) => {
  const { 
    id, date, hero, role, mmrChange, gameDifficulty, isTokenGame, 
    result, moodStart, moodEnd, comment 
  } = match;
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };
  
  const handleConfirmDelete = () => {
    onDelete(id);
    setShowDeleteConfirm(false);
  };
  
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl`}>
      {/* Header with result indicator */}
      <div className={`w-full h-1 ${
        result === 'win' ? 'bg-green-500' : 'bg-red-500'
      }`}></div>
      
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-start gap-3">
              {/* Hero Icon */}
              <HeroIcon heroName={hero} size="md" />
              
              <div className="flex items-center gap-2 mt-1">
                <h3 className="font-bold text-xl">{hero}</h3>
                <div>
                  {isTokenGame && (
                    <span className="px-2 py-0.5 text-xs bg-yellow-800 text-yellow-200 rounded-full">
                      Token
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-gray-400 mt-2">{format(new Date(date), 'MMM dd, yyyy HH:mm')}</p>
          </div>
          <div className={`px-4 py-2 rounded-full font-bold text-lg ${
            mmrChange > 0 ? 'bg-green-900/40 text-green-400 border border-green-700' : 'bg-red-900/40 text-red-400 border border-red-700'
          }`}>
            {mmrChange > 0 ? `+${mmrChange}` : mmrChange}
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="flex items-center">
            <span className="text-gray-400 mr-1">Role:</span> 
            <span className="px-2 py-0.5 bg-gray-700 rounded text-white">
              {ROLE_LABELS[role]}
            </span>
          </div>
          <div>
            <span className="text-gray-400 mr-1">Game Difficulty:</span> 
            <span className="font-medium">{GAME_DIFFICULTY_LABELS[gameDifficulty]}</span>
          </div>
          <div>
            <span className="text-gray-400 mr-1">Result:</span> 
            <span className={result === 'win' ? 'text-green-400' : 'text-red-400'}>
              {GAME_RESULT_LABELS[result]}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">Mood:</span>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full" 
                    style={{ backgroundColor: MOODS[moodStart].color }}
                    title={MOODS[moodStart].label}></span>
              <span className="mx-1">→</span>
              <span className="inline-block w-3 h-3 rounded-full" 
                    style={{ backgroundColor: MOODS[moodEnd].color }}
                    title={MOODS[moodEnd].label}></span>
            </div>
          </div>
        </div>
        
        {comment && (
          <div className="mt-3 bg-gray-700/50 p-3 rounded-md text-sm">
            <span className="text-gray-400 font-medium">Comment:</span> {comment}
          </div>
        )}
        
        <div className="mt-4 text-right">
          {showDeleteConfirm ? (
            <div className="flex justify-end space-x-2">
              <button 
                onClick={handleCancelDelete}
                className="text-gray-400 hover:text-gray-300 text-sm px-3 py-1 hover:bg-gray-700 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="text-red-400 hover:text-red-300 text-sm px-3 py-1 bg-red-900/30 hover:bg-red-900/50 rounded"
              >
                Confirm Delete
              </button>
            </div>
          ) : (
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => onEdit(match)}
                className="text-blue-400 hover:text-blue-300 text-sm px-3 py-1 hover:bg-blue-900/30 rounded transition-colors"
              >
                Edit
              </button>
              <button 
                onClick={handleDeleteClick}
                className="text-red-400 hover:text-red-300 text-sm px-3 py-1 hover:bg-red-900/30 rounded transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
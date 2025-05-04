import React, { useState, useRef, useEffect } from 'react';
import { 
  GAME_DIFFICULTIES, 
  GAME_DIFFICULTY_LABELS, 
  ROLES, 
  ROLE_LABELS, 
  MOODS, 
  GAME_RESULT,
  GAME_RESULT_LABELS,
  HEROES 
} from '../../features/matches/constants';
import { Match, Mood } from '../../features/matches/types';

interface EditMatchModalProps {
  match: Match;
  onSave: (id: string, matchData: Partial<Omit<Match, 'id' | 'date'>>) => void;
  onCancel: () => void;
}

const EditMatchModal: React.FC<EditMatchModalProps> = ({ match, onSave, onCancel }) => {
  const [hero, setHero] = useState(match.hero);
  const [showAllHeroes, setShowAllHeroes] = useState(false);
  const [filteredHeroes, setFilteredHeroes] = useState<Array<typeof HEROES[number]>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [role, setRole] = useState<number | ''>(match.role);
  const [mmrChange, setMmrChange] = useState<number>(match.mmrChange);
  const [gameDifficulty, setGameDifficulty] = useState<Match['gameDifficulty']>(match.gameDifficulty);
  const [isTokenGame, setIsTokenGame] = useState(match.isTokenGame);
  const [result, setResult] = useState<Match['result']>(match.result);
  const [moodStart, setMoodStart] = useState<Mood>(match.moodStart);
  const [moodEnd, setMoodEnd] = useState<Mood>(match.moodEnd);
  const [comment, setComment] = useState(match.comment || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showMmrPresets, setShowMmrPresets] = useState(false);

  const heroInputRef = useRef<HTMLInputElement>(null);
  
  const mmrPresets = [
    { value: 30, label: '+30' },
    { value: 25, label: '+25' },
    { value: 20, label: '+20' },
    { value: 0, label: '0' },
    { value: -20, label: '-20' },
    { value: -25, label: '-25' },
    { value: -30, label: '-30' }
  ];

  useEffect(() => {
    if (showAllHeroes && hero.trim() === '') {
      setFilteredHeroes([...HEROES]);
      return;
    }
    
    if (hero.trim() === '') {
      setFilteredHeroes([]);
      return;
    }
    
    const filtered = HEROES.filter(h => 
      h.toLowerCase().includes(hero.toLowerCase())
    ).slice(0, 5); 
    
    setFilteredHeroes([...filtered]); 
  }, [hero, showAllHeroes]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.hero-suggestion') && target !== heroInputRef.current) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isInput = target instanceof HTMLInputElement;
      const isNumberInput = isInput && target.type === 'number';
      
      if (!target.closest('.mmr-presets') && !isNumberInput) {
        setShowMmrPresets(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleHeroSelect = (selectedHero: string) => {
    setHero(selectedHero);
    setShowSuggestions(false);
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!hero.trim()) newErrors.hero = 'Hero is required';
    if (!role) newErrors.role = 'Role is required';
    if (mmrChange === undefined) newErrors.mmrChange = 'MMR change is required';
    if (!gameDifficulty) newErrors.gameDifficulty = 'Game difficulty is required';
    if (!result) newErrors.result = 'Result is required';
    if (!moodStart) newErrors.moodStart = 'Start mood is required';
    if (!moodEnd) newErrors.moodEnd = 'End mood is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    onSave(match.id, {
      hero,
      role: Number(role) as 1 | 2 | 3 | 4 | 5,
      mmrChange,
      gameDifficulty,
      isTokenGame,
      result,
      moodStart,
      moodEnd,
      comment: comment || undefined
    });
  };
  
  const handleMmrChangeUpdate = (value: number) => {
    setMmrChange(value);
    
    if (value !== 0) {
      setResult(value > 0 ? 'win' : 'loss');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 border border-gray-700 shadow-2xl my-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-dota-red">Edit Match</h2>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hero with autocomplete */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1 text-gray-300">Hero</label>
            <input
              ref={heroInputRef}
              type="text"
              value={hero}
              onChange={(e) => {
                setHero(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                setShowSuggestions(true);
                setShowAllHeroes(true);
              }}
              onBlur={() => {
                setTimeout(() => {
                  setShowAllHeroes(false);
                }, 200);
              }}
              className={`w-full bg-gray-700 border ${errors.hero ? 'border-red-500' : 'border-gray-600'} rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-dota-red`}
              placeholder="Enter hero name"
            />
            {errors.hero && <p className="text-red-500 text-xs mt-1">{errors.hero}</p>}
            
            {/* Hero suggestions */}
            {showSuggestions && filteredHeroes.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredHeroes.map(heroName => (
                  <div
                    key={heroName}
                    className="hero-suggestion px-3 py-2 hover:bg-gray-600 cursor-pointer"
                    onClick={() => {
                      handleHeroSelect(heroName);
                    }}
                  >
                    {heroName}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Top Row - Role and MMR */}
          <div className="grid grid-cols-2 gap-4">
            {/* Role */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Role</label>
              <select
                value={role}
                onChange={(e) => {
                  const value = e.target.value;
                  setRole(value ? Number(value) as 1 | 2 | 3 | 4 | 5 : '');
                }}
                className={`w-full bg-gray-700 border ${errors.role ? 'border-red-500' : 'border-gray-600'} rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-dota-red`}
              >
                <option value="">Select role</option>
                {ROLES.map(r => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
            </div>
            
            {/* MMR Change */}
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">MMR Change</label>
                <div className="relative">
                    <input
                    type="number"
                    value={mmrChange || match.mmrChange}
                    onChange={(e) => {
                        const value = e.target.value ? parseInt(e.target.value) : '';
                        handleMmrChangeUpdate(value as number);
                        if (typeof value === 'number' && value !== 0) {
                        setResult(value > 0 ? 'win' : 'loss');
                        }
                    }}
                    onFocus={() => setShowMmrPresets(true)}
                    className={`w-full bg-gray-700 border ${errors.mmrChange ? 'border-red-500' : 'border-gray-600'} rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-dota-red`}
                    placeholder={`Текущее: ${match.mmrChange > 0 ? '+' + match.mmrChange : match.mmrChange}`}
                    />
                    {showMmrPresets && (
                        <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg overflow-hidden mmr-presets">
                        <div className="grid grid-cols-4">
                            {mmrPresets
                            .filter(preset => preset.value >= 0)
                            .map((preset) => (
                                <button
                                key={preset.value}
                                type="button"
                                onClick={() => {
                                    handleMmrChangeUpdate(preset.value);
                                    setShowMmrPresets(false);
                                }}
                                className={`px-3 py-2 text-center hover:bg-gray-600 ${
                                    preset.value > 0 
                                    ? 'text-green-400' 
                                    : 'text-gray-300'
                                }`}
                                >
                                {preset.label}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-4">
                            {mmrPresets
                            .filter(preset => preset.value < 0)
                            .map((preset) => (
                                <button
                                key={preset.value}
                                type="button"
                                onClick={() => {
                                    handleMmrChangeUpdate(preset.value);
                                    setShowMmrPresets(false);
                                }}
                                className="px-3 py-2 text-center hover:bg-gray-600 text-red-400"
                                >
                                {preset.label}
                                </button>
                            ))}
                        </div>
                        </div>
                    )}
                </div>
                {errors.mmrChange && <p className="text-red-500 text-xs mt-1">{errors.mmrChange}</p>}
            </div>
          </div>
          
          {/* Game Difficulty and Token Game */}
          <div className="grid grid-cols-2 gap-4">
            {/* Game Difficulty */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Game Difficulty</label>
              <select
                value={gameDifficulty}
                onChange={(e) => {
                  setGameDifficulty(e.target.value as Match['gameDifficulty']);
                }}
                className={`w-full bg-gray-700 border ${errors.gameDifficulty ? 'border-red-500' : 'border-gray-600'} rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-dota-red`}
              >
                <option value="">Select difficulty</option>
                {Object.values(GAME_DIFFICULTIES).map(difficulty => (
                  <option key={difficulty} value={difficulty}>{GAME_DIFFICULTY_LABELS[difficulty]}</option>
                ))}
              </select>
              {errors.gameDifficulty && <p className="text-red-500 text-xs mt-1">{errors.gameDifficulty}</p>}
            </div>
            
            {/* Token Game */}
            <div className="flex items-center h-full pt-6">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTokenGame}
                  onChange={(e) => setIsTokenGame(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-dota-red rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dota-red"></div>
                <span className="ms-3 text-sm font-medium text-gray-300">Token Game</span>
              </label>
            </div>
          </div>
          
          {/* Result */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Result</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="win"
                  checked={result === 'win'}
                  onChange={() => setResult('win')}
                  className="form-radio text-green-500 h-5 w-5"
                />
                <span className="ml-2 text-gray-300">{GAME_RESULT_LABELS.win}</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="loss"
                  checked={result === 'loss'}
                  onChange={() => setResult('loss')}
                  className="form-radio text-red-500 h-5 w-5"
                />
                <span className="ml-2 text-gray-300">{GAME_RESULT_LABELS.loss}</span>
              </label>
            </div>
            {errors.result && <p className="text-red-500 text-xs mt-1">{errors.result}</p>}
          </div>
          
          {/* Mood Start and End */}
          <div className="grid grid-cols-2 gap-4">
            {/* Mood Start */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Mood (Start)</label>
              <select
                value={moodStart}
                onChange={(e) => setMoodStart(e.target.value as Mood)}
                className={`w-full bg-gray-700 border ${errors.moodStart ? 'border-red-500' : 'border-gray-600'} rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-dota-red`}
              >
                <option value="">Select mood</option>
                {Object.entries(MOODS).map(([value, { label }]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              {moodStart && (
                <div className="mt-1 flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-2" 
                    style={{ backgroundColor: MOODS[moodStart]?.color }}
                  ></div>
                  <span className="text-xs">{MOODS[moodStart]?.label}</span>
                </div>
              )}
              {errors.moodStart && <p className="text-red-500 text-xs mt-1">{errors.moodStart}</p>}
            </div>
            
            {/* Mood End */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Mood (End)</label>
              <select
                value={moodEnd}
                onChange={(e) => setMoodEnd(e.target.value as Mood)}
                className={`w-full bg-gray-700 border ${errors.moodEnd ? 'border-red-500' : 'border-gray-600'} rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-dota-red`}
              >
                <option value="">Select mood</option>
                {Object.entries(MOODS).map(([value, { label }]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              {moodEnd && (
                <div className="mt-1 flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-2" 
                    style={{ backgroundColor: MOODS[moodEnd]?.color }}
                  ></div>
                  <span className="text-xs">{MOODS[moodEnd]?.label}</span>
                </div>
              )}
              {errors.moodEnd && <p className="text-red-500 text-xs mt-1">{errors.moodEnd}</p>}
            </div>
          </div>
          
          {/* Comment */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Comment (Optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-dota-red"
              rows={3}
              placeholder="Any comments about this match?"
            />
          </div>
          
          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-dota-red text-white rounded-md hover:bg-red-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMatchModal;
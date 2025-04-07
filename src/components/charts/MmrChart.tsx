import React, { useMemo, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  Brush
} from 'recharts';
import { format, subDays, startOfDay, endOfDay, isToday } from 'date-fns';
import { Match } from '../../features/matches/types';

interface MmrChartProps {
  matches: Match[];
}

type TimeRange = 'today' | '7days' | '30days' | '90days' | 'all';

const MmrChart: React.FC<MmrChartProps> = ({ matches }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('today');

  const timeFilteredMatches = useMemo(() => {
    if (timeRange === 'all') return matches;
    
    const now = new Date();
    
    if (timeRange === 'today') {
      const todayStart = startOfDay(now);
      return matches.filter(match => 
        new Date(match.date) >= todayStart
      );
    }
    
    const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
    const cutoffDate = subDays(startOfDay(now), days);
    
    return matches.filter(match => 
      new Date(match.date) >= cutoffDate
    );
  }, [matches, timeRange]);

  const hasTodayGames = useMemo(() => {
    return matches.some(match => isToday(new Date(match.date)));
  }, [matches]);

  const chartData = useMemo(() => {
    if (timeFilteredMatches.length === 0) return [];
    
    let startMmr = 0;
    if (timeFilteredMatches.length > 0) {
      const earliestMatch = [...timeFilteredMatches].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )[0];
      
      const matchesBeforeRange = matches
        .filter(match => new Date(match.date) < new Date(earliestMatch.date))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      startMmr = matchesBeforeRange.reduce((sum, match) => sum + match.mmrChange, 0);
    }
    
    const sortedMatches = [...timeFilteredMatches].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    let cumulativeMmr = startMmr;
    const allMatchesData = sortedMatches.map((match, index) => {
      cumulativeMmr += match.mmrChange;
      return {
        name: format(new Date(match.date), 'HH:mm'),
        dateFormatted: format(new Date(match.date), 'MM/dd HH:mm'),
        date: new Date(match.date),
        mmr: cumulativeMmr,
        hero: match.hero,
        change: match.mmrChange,
        index: index + 1,
      };
    });
    
    return allMatchesData;
  }, [timeFilteredMatches, matches]);

  const mmrRange = useMemo(() => {
    if (chartData.length === 0) return { min: 0, max: 0 };
    
    const mmrValues = chartData.map(data => data.mmr);
    const min = Math.min(...mmrValues);
    const max = Math.max(...mmrValues);
    
    const padding = Math.max(30, Math.round((max - min) * 0.1));
    
    return {
      min: min - padding,
      max: max + padding
    };
  }, [chartData]);

  if (matches.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
        <p className="text-gray-400">No matches available to display chart.</p>
      </div>
    );
  }

  if (timeFilteredMatches.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-xl font-bold text-dota-red">MMR Progression</h2>
          
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <button 
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1 rounded-md text-sm ${timeRange === 'today' ? 'bg-dota-red text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Today
            </button>
            <button 
              onClick={() => setTimeRange('7days')}
              className={`px-3 py-1 rounded-md text-sm ${timeRange === '7days' ? 'bg-dota-red text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              7 Days
            </button>
            <button 
              onClick={() => setTimeRange('30days')}
              className={`px-3 py-1 rounded-md text-sm ${timeRange === '30days' ? 'bg-dota-red text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              30 Days
            </button>
            <button 
              onClick={() => setTimeRange('90days')}
              className={`px-3 py-1 rounded-md text-sm ${timeRange === '90days' ? 'bg-dota-red text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              90 Days
            </button>
            <button 
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1 rounded-md text-sm ${timeRange === 'all' ? 'bg-dota-red text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              All Time
            </button>
          </div>
        </div>
        
        <div className="text-center py-8">
          <p className="text-gray-400">
            {timeRange === 'today' && !hasTodayGames 
              ? "You haven't played any games today." 
              : `No games found in the selected time range (${timeRange}).`}
          </p>
          {timeRange !== 'all' && (
            <button 
              onClick={() => setTimeRange('all')}
              className="mt-4 px-4 py-2 bg-dota-red text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Show All Games
            </button>
          )}
        </div>
      </div>
    );
  }

  const calculateMmrStats = () => {
    if (timeFilteredMatches.length === 0) return { change: 0, perDay: 0, gamesCount: 0 };
    
    const totalChange = timeFilteredMatches.reduce((sum, match) => sum + match.mmrChange, 0);
    
    let perDay = 0;
    if (timeFilteredMatches.length > 1 && timeRange !== 'today') {
      const oldestMatch = new Date(Math.min(...timeFilteredMatches.map(m => new Date(m.date).getTime())));
      const newestMatch = new Date(Math.max(...timeFilteredMatches.map(m => new Date(m.date).getTime())));
      const daysDiff = Math.max(1, Math.round((newestMatch.getTime() - oldestMatch.getTime()) / (1000 * 60 * 60 * 24)));
      perDay = totalChange / daysDiff;
    } else if (timeRange === 'today') {
      perDay = totalChange;
    }
    
    return { 
      change: totalChange, 
      perDay: perDay,
      gamesCount: timeFilteredMatches.length
    };
  };
  
  const stats = calculateMmrStats();

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-bold text-dota-red">MMR Progression</h2>
        
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          <button 
            onClick={() => setTimeRange('today')}
            className={`px-3 py-1 rounded-md text-sm ${timeRange === 'today' ? 'bg-dota-red text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            Today
          </button>
          <button 
            onClick={() => setTimeRange('7days')}
            className={`px-3 py-1 rounded-md text-sm ${timeRange === '7days' ? 'bg-dota-red text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            7 Days
          </button>
          <button 
            onClick={() => setTimeRange('30days')}
            className={`px-3 py-1 rounded-md text-sm ${timeRange === '30days' ? 'bg-dota-red text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            30 Days
          </button>
          <button 
            onClick={() => setTimeRange('90days')}
            className={`px-3 py-1 rounded-md text-sm ${timeRange === '90days' ? 'bg-dota-red text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            90 Days
          </button>
          <button 
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1 rounded-md text-sm ${timeRange === 'all' ? 'bg-dota-red text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            All Time
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-xs uppercase tracking-wide text-gray-400 font-semibold">MMR CHANGE</div>
          <div className={`text-2xl font-bold mt-1 ${stats.change > 0 ? 'text-green-400' : stats.change < 0 ? 'text-red-400' : 'text-gray-300'}`}>
            {stats.change > 0 ? `+${stats.change}` : stats.change}
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
            {timeRange === 'today' ? 'TOTAL TODAY' : 'AVG. PER DAY'}
          </div>
          <div className={`text-2xl font-bold mt-1 ${stats.perDay > 0 ? 'text-green-400' : stats.perDay < 0 ? 'text-red-400' : 'text-gray-300'}`}>
            {stats.perDay > 0 ? `+${stats.perDay.toFixed(1)}` : stats.perDay.toFixed(1)}
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-xs uppercase tracking-wide text-gray-400 font-semibold">GAMES</div>
          <div className="text-2xl font-bold mt-1 text-gray-300">
            {stats.gamesCount}
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis 
              dataKey={timeRange === 'today' ? 'name' : 'index'} 
              stroke="#999"
              label={{ 
                value: timeRange === 'today' ? 'Time' : 'Games Played', 
                position: 'insideBottomRight', 
                offset: -5, 
                fill: '#999' 
              }}
            />
            <YAxis 
              domain={[mmrRange.min, mmrRange.max]}
              stroke="#999"
              label={{ value: 'MMR', angle: -90, position: 'insideLeft', fill: '#999' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#333', borderColor: '#555' }} 
              formatter={(value) => [value, 'MMR']}
              labelFormatter={(value) => {
                const item = timeRange === 'today' 
                  ? chartData.find(d => d.name === value)
                  : chartData[Number(value) - 1];
                if (!item) return value;
                return `${item.hero} (${item.change > 0 ? '+' : ''}${item.change}) - ${item.dateFormatted}`;
              }}
            />
            
            <Line 
              type="monotone" 
              dataKey="mmr" 
              stroke="#FF4B4B" 
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2, fill: '#333' }}
              activeDot={{ r: 8 }}
              name="MMR"
            />
            
            <ReferenceLine y={0} stroke="#666" />
            {chartData.length > 10 && (
              <Brush 
                dataKey={timeRange === 'today' ? 'name' : 'index'} 
                height={30} 
                stroke="#777" 
                fill="#444"
                startIndex={timeRange === 'today' ? 0 : Math.max(0, chartData.length - 20)} 
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MmrChart;
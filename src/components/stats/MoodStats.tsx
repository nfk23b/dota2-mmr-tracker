import React, { useMemo } from 'react';
import { Match, Mood } from '../../features/matches/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface MoodStatsProps {
  matches: Match[];
}

const MoodStats: React.FC<MoodStatsProps> = ({ matches }) => {
  const moodEmojis = {
    terrible: '😡',
    bad: '😞',
    neutral: '😐',
    good: '🙂',
    great: '😄'
  };

  const moodColors = {
    terrible: '#EF4444',
    bad: '#F97316',
    neutral: '#6B7280',
    good: '#10B981',
    great: '#059669'
  };

  const moodOrder: Mood[] = ['terrible', 'bad', 'neutral', 'good', 'great'];

  const moodStats = useMemo(() => {
    // Starting mood analysis
    const startMoodStats = moodOrder.map(mood => {
      const moodMatches = matches.filter(match => match.moodStart === mood);
      const wins = moodMatches.filter(match => match.result === 'win').length;
      const losses = moodMatches.filter(match => match.result === 'loss').length;
      const totalGames = moodMatches.length;
      const winrate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
      const totalMmr = moodMatches.reduce((sum, match) => sum + match.mmrChange, 0);
      const avgMmr = totalGames > 0 ? totalMmr / totalGames : 0;

      return {
        mood,
        moodLabel: `${moodEmojis[mood]} ${mood.charAt(0).toUpperCase() + mood.slice(1)}`,
        totalGames,
        wins,
        losses,
        winrate,
        totalMmr,
        avgMmr
      };
    }).filter(stat => stat.totalGames > 0);

    // Ending mood analysis
    const endMoodStats = moodOrder.map(mood => {
      const moodMatches = matches.filter(match => match.moodEnd === mood);
      const wins = moodMatches.filter(match => match.result === 'win').length;
      const losses = moodMatches.filter(match => match.result === 'loss').length;
      const totalGames = moodMatches.length;
      const winrate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
      const totalMmr = moodMatches.reduce((sum, match) => sum + match.mmrChange, 0);
      const avgMmr = totalGames > 0 ? totalMmr / totalGames : 0;

      return {
        mood,
        moodLabel: `${moodEmojis[mood]} ${mood.charAt(0).toUpperCase() + mood.slice(1)}`,
        totalGames,
        wins,
        losses,
        winrate,
        totalMmr,
        avgMmr
      };
    }).filter(stat => stat.totalGames > 0);

    return { startMoodStats, endMoodStats };
  }, [matches]);

  // Mood change analysis
  const moodChangeStats = useMemo(() => {
    const moodToNumber = (mood: Mood) => {
      const map = { terrible: 1, bad: 2, neutral: 3, good: 4, great: 5 };
      return map[mood];
    };

    const changes = matches.map(match => {
      const startValue = moodToNumber(match.moodStart);
      const endValue = moodToNumber(match.moodEnd);
      const change = endValue - startValue;
      
      return {
        ...match,
        moodChange: change,
        moodImproved: change > 0,
        moodDeclined: change < 0,
        moodStayed: change === 0
      };
    });

    const improved = changes.filter(c => c.moodImproved);
    const declined = changes.filter(c => c.moodDeclined);
    const stayed = changes.filter(c => c.moodStayed);

    return {
      improved: {
        count: improved.length,
        winrate: improved.length > 0 ? (improved.filter(c => c.result === 'win').length / improved.length) * 100 : 0,
        avgMmr: improved.length > 0 ? improved.reduce((sum, c) => sum + c.mmrChange, 0) / improved.length : 0
      },
      declined: {
        count: declined.length,
        winrate: declined.length > 0 ? (declined.filter(c => c.result === 'win').length / declined.length) * 100 : 0,
        avgMmr: declined.length > 0 ? declined.reduce((sum, c) => sum + c.mmrChange, 0) / declined.length : 0
      },
      stayed: {
        count: stayed.length,
        winrate: stayed.length > 0 ? (stayed.filter(c => c.result === 'win').length / stayed.length) * 100 : 0,
        avgMmr: stayed.length > 0 ? stayed.reduce((sum, c) => sum + c.mmrChange, 0) / stayed.length : 0
      }
    };
  }, [matches]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold">{data.moodLabel}</p>
          <p className="text-gray-300">Games: {data.totalGames}</p>
          <p className="text-gray-300">Record: {data.wins}-{data.losses}</p>
          <p className={`font-medium ${data.winrate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
            Winrate: {data.winrate.toFixed(1)}%
          </p>
          <p className={`font-medium ${data.avgMmr >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            Avg MMR: {data.avgMmr >= 0 ? '+' : ''}{data.avgMmr.toFixed(1)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (matches.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
        <p className="text-gray-400">No matches available to display mood statistics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mood Change Overview */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-dota-red">Mood Impact Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Mood Improved</h3>
            <div className="text-2xl font-bold text-green-400">{moodChangeStats.improved.count}</div>
            <div className="text-sm text-gray-300">
              {moodChangeStats.improved.winrate.toFixed(1)}% WR, {moodChangeStats.improved.avgMmr >= 0 ? '+' : ''}{moodChangeStats.improved.avgMmr.toFixed(1)} MMR
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Mood Declined</h3>
            <div className="text-2xl font-bold text-red-400">{moodChangeStats.declined.count}</div>
            <div className="text-sm text-gray-300">
              {moodChangeStats.declined.winrate.toFixed(1)}% WR, {moodChangeStats.declined.avgMmr >= 0 ? '+' : ''}{moodChangeStats.declined.avgMmr.toFixed(1)} MMR
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Mood Stayed Same</h3>
            <div className="text-2xl font-bold text-gray-400">{moodChangeStats.stayed.count}</div>
            <div className="text-sm text-gray-300">
              {moodChangeStats.stayed.winrate.toFixed(1)}% WR, {moodChangeStats.stayed.avgMmr >= 0 ? '+' : ''}{moodChangeStats.stayed.avgMmr.toFixed(1)} MMR
            </div>
          </div>
        </div>
      </div>

      {/* Starting Mood Analysis */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-dota-red">Performance by Starting Mood</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4">Starting Mood</th>
                <th className="text-right py-3 px-4">Games</th>
                <th className="text-right py-3 px-4">Winrate</th>
                <th className="text-right py-3 px-4">Record</th>
                <th className="text-right py-3 px-4">Total MMR</th>
                <th className="text-right py-3 px-4">Avg MMR</th>
                <th className="text-right py-3 px-4">Performance</th>
              </tr>
            </thead>
            <tbody>
              {moodStats.startMoodStats.map(stat => (
                <tr key={`start-${stat.mood}`} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                  <td className="py-3 px-4 font-medium">{stat.moodLabel}</td>
                  <td className="text-right py-3 px-4">{stat.totalGames}</td>
                  <td className="text-right py-3 px-4">
                    <span className={`font-medium px-2 py-1 rounded ${
                      stat.winrate >= 60 ? 'bg-green-900 text-green-400' :
                      stat.winrate >= 50 ? 'bg-yellow-900 text-yellow-400' :
                      'bg-red-900 text-red-400'
                    }`}>
                      {stat.winrate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-right py-3 px-4 text-gray-300">
                    <span className="text-green-400">{stat.wins}</span>-<span className="text-red-400">{stat.losses}</span>
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className={`font-medium ${stat.totalMmr > 0 ? 'text-green-400' : stat.totalMmr < 0 ? 'text-red-400' : 'text-gray-300'}`}>
                      {stat.totalMmr > 0 ? '+' : ''}{stat.totalMmr}
                    </span>
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className={`font-medium ${stat.avgMmr > 0 ? 'text-green-400' : stat.avgMmr < 0 ? 'text-red-400' : 'text-gray-300'}`}>
                      {stat.avgMmr > 0 ? '+' : ''}{stat.avgMmr.toFixed(1)}
                    </span>
                  </td>
                  <td className="text-right py-3 px-4">
                    <div className="flex items-center justify-end">
                      <div className="w-16 bg-gray-600 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full`}
                          style={{ 
                            width: `${Math.min(100, stat.winrate)}%`,
                            backgroundColor: moodColors[stat.mood]
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-8">
                        {stat.winrate.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ending Mood Analysis */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-dota-red">Performance by Ending Mood</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4">Ending Mood</th>
                <th className="text-right py-3 px-4">Games</th>
                <th className="text-right py-3 px-4">Winrate</th>
                <th className="text-right py-3 px-4">Record</th>
                <th className="text-right py-3 px-4">Total MMR</th>
                <th className="text-right py-3 px-4">Avg MMR</th>
                <th className="text-right py-3 px-4">Performance</th>
              </tr>
            </thead>
            <tbody>
              {moodStats.endMoodStats.map(stat => (
                <tr key={`end-${stat.mood}`} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                  <td className="py-3 px-4 font-medium">{stat.moodLabel}</td>
                  <td className="text-right py-3 px-4">{stat.totalGames}</td>
                  <td className="text-right py-3 px-4">
                    <span className={`font-medium px-2 py-1 rounded ${
                      stat.winrate >= 60 ? 'bg-green-900 text-green-400' :
                      stat.winrate >= 50 ? 'bg-yellow-900 text-yellow-400' :
                      'bg-red-900 text-red-400'
                    }`}>
                      {stat.winrate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-right py-3 px-4 text-gray-300">
                    <span className="text-green-400">{stat.wins}</span>-<span className="text-red-400">{stat.losses}</span>
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className={`font-medium ${stat.totalMmr > 0 ? 'text-green-400' : stat.totalMmr < 0 ? 'text-red-400' : 'text-gray-300'}`}>
                      {stat.totalMmr > 0 ? '+' : ''}{stat.totalMmr}
                    </span>
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className={`font-medium ${stat.avgMmr > 0 ? 'text-green-400' : stat.avgMmr < 0 ? 'text-red-400' : 'text-gray-300'}`}>
                      {stat.avgMmr > 0 ? '+' : ''}{stat.avgMmr.toFixed(1)}
                    </span>
                  </td>
                  <td className="text-right py-3 px-4">
                    <div className="flex items-center justify-end">
                      <div className="w-16 bg-gray-600 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full`}
                          style={{ 
                            width: `${Math.min(100, stat.winrate)}%`,
                            backgroundColor: moodColors[stat.mood]
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-8">
                        {stat.winrate.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-dota-red">Mood Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-300">Key Findings:</h3>
            <ul className="text-gray-400 space-y-1">
              <li>• Games where mood improved: {moodChangeStats.improved.count}</li>
              <li>• Games where mood declined: {moodChangeStats.declined.count}</li>
              <li>• Best starting mood: {moodStats.startMoodStats.sort((a, b) => b.winrate - a.winrate)[0]?.moodLabel || 'N/A'}</li>
              <li>• Most common ending mood: {moodStats.endMoodStats.sort((a, b) => b.totalGames - a.totalGames)[0]?.moodLabel || 'N/A'}</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-300">Recommendations:</h3>
            <ul className="text-gray-400 space-y-1">
              <li>• Avoid playing when starting mood is poor</li>
              <li>• Take breaks when mood declines</li>
              <li>• Track what affects your mood positively</li>
              <li>• Consider mood management techniques</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodStats;
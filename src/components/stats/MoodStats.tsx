import React from 'react';
import { Match, Mood } from '../../features/matches/types';
import { MOODS } from '../../features/matches/constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface MoodStatsProps {
  matches: Match[];
}

const MoodStats: React.FC<MoodStatsProps> = ({ matches }) => {
  if (matches.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
        <p className="text-gray-400">No matches available to display mood statistics.</p>
      </div>
    );
  }

  const startMoodData = Object.entries(MOODS).map(([mood, { label, color }]) => {
    const count = matches.filter(match => match.moodStart === mood).length;
    return { name: label, value: count, color, mood };
  }).filter(item => item.value > 0);
  
  const endMoodData = Object.entries(MOODS).map(([mood, { label, color }]) => {
    const count = matches.filter(match => match.moodEnd === mood).length;
    return { name: label, value: count, color, mood };
  }).filter(item => item.value > 0);

  const moodImpactData = Object.entries(MOODS).map(([mood, { label, color }]) => {
    const moodMatches = matches.filter(match => match.moodStart === mood);
    const wins = moodMatches.filter(match => match.result === 'win').length;
    const total = moodMatches.length;
    const winrate = total > 0 ? (wins / total) * 100 : 0;
    const totalMmr = moodMatches.reduce((sum, match) => sum + match.mmrChange, 0);
    const avgMmr = total > 0 ? totalMmr / total : 0;
    
    return {
      mood: label,
      moodType: mood,
      color,
      winrate,
      totalGames: total,
      wins, 
      losses: total - wins,
      totalMmr,
      avgMmr
    };
  }).filter(item => item.totalGames > 0);

  const moodTransitionData: Record<string, Record<string, number>> = {};
  const moodTransitionCounts: Record<string, number> = {};
  
  matches.forEach(match => {
    if (!moodTransitionData[match.moodStart]) {
      moodTransitionData[match.moodStart] = {};
      moodTransitionCounts[match.moodStart] = 0;
    }
    
    if (!moodTransitionData[match.moodStart][match.moodEnd]) {
      moodTransitionData[match.moodStart][match.moodEnd] = 0;
    }
    
    moodTransitionData[match.moodStart][match.moodEnd]++;
    moodTransitionCounts[match.moodStart]++;
  });
  
  const moodTransitionStats = Object.entries(moodTransitionData).map(([startMood, endMoods]) => {
    const transitions = Object.entries(endMoods).map(([endMood, count]) => {
      const percentage = (count / moodTransitionCounts[startMood]) * 100;
      return {
        endMood,
        count,
        percentage
      };
    }).sort((a, b) => b.count - a.count);
    
    return {
      startMood,
      startMoodLabel: MOODS[startMood as Mood].label,
      startMoodColor: MOODS[startMood as Mood].color,
      totalMatches: moodTransitionCounts[startMood],
      transitions
    };
  }).sort((a, b) => b.totalMatches - a.totalMatches);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-dota-red">Mood Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-center">Starting Mood</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={startMoodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {startMoodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} games`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2 text-center">Ending Mood</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={endMoodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {endMoodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} games`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Mood Impact on Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-3">Starting Mood</th>
                <th className="text-right py-2 px-3">Games</th>
                <th className="text-right py-2 px-3">Winrate</th>
                <th className="text-right py-2 px-3">Record</th>
                <th className="text-right py-2 px-3">Avg MMR</th>
              </tr>
            </thead>
            <tbody>
              {moodImpactData.sort((a, b) => b.winrate - a.winrate).map(data => (
                <tr key={data.moodType} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-2 px-3 font-medium">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: data.color }}
                      ></div>
                      {data.mood}
                    </div>
                  </td>
                  <td className="text-right py-2 px-3">{data.totalGames}</td>
                  <td className="text-right py-2 px-3">
                    <span className={`font-medium ${data.winrate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                      {data.winrate % 1 === 0 ? data.winrate.toFixed(0) : data.winrate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-right py-2 px-3 text-gray-300">
                    {data.wins}-{data.losses}
                  </td>
                  <td className="text-right py-2 px-3">
                    <span className={data.avgMmr > 0 ? 'text-green-400' : data.avgMmr < 0 ? 'text-red-400' : 'text-gray-300'}>
                      {data.avgMmr > 0 ? '+' : ''}
                      {data.avgMmr % 1 === 0 ? data.avgMmr.toFixed(0) : data.avgMmr.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Mood Transitions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {moodTransitionStats.map(stat => (
            <div key={stat.startMood} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div 
                  className="w-4 h-4 rounded-full mr-2" 
                  style={{ backgroundColor: stat.startMoodColor }}
                ></div>
                <h4 className="font-medium">{stat.startMoodLabel} → After Game</h4>
                <span className="ml-auto text-sm text-gray-400">{stat.totalMatches} games</span>
              </div>
              <div className="space-y-2">
                {stat.transitions.map(transition => (
                  <div key={transition.endMood} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: MOODS[transition.endMood as Mood].color }}
                    ></div>
                    <span className="text-sm">{MOODS[transition.endMood as Mood].label}</span>
                    <div className="ml-2 flex-1 bg-gray-600 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${transition.percentage}%`,
                          backgroundColor: MOODS[transition.endMood as Mood].color 
                        }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm">
                      {transition.percentage % 1 === 0 ? 
                        transition.percentage.toFixed(0) : 
                        transition.percentage.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodStats;
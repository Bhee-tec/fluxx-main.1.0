'use client'
import React, { useEffect, useState } from 'react';
import Navbar from 'components/ui/Navbar';

interface ProgressState {
  coinWidth: number;
  xpWidth: number;
}

interface TaskItem {
  type: 'deposit' | 'withdrawal' | 'reward';
  amount: string;
  details: string;
  date: string;
  status: string;
}

export default function Task() {
  const [progress, setProgress] = useState<ProgressState[] | null>(null);
  const [tasks] = useState<TaskItem[]>(() => [
    { type: 'reward', amount: '+50 FLX', details: 'Daily Bonus', date: '2024-02-15', status: '🎉 Claimed' },
    { type: 'reward', amount: '+50 FLX', details: 'Daily Bonus', date: '2024-02-14', status: '🎉 Claimed' },
    { type: 'reward', amount: '+50 FLX', details: 'Daily Bonus', date: '2024-02-13', status: '🎉 Claimed' },
    // Add more tasks as needed...
  ]);

  useEffect(() => {
    setProgress(
      Array(tasks.length).fill(null).map(() => ({
        coinWidth: Math.random() * 60 + 40,
        xpWidth: Math.random() * 80 + 20
      }))
    );
  }, [tasks.length]);

  if (!progress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#06060F] to-[#1a1c2f] p-4 md:p-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-[#0e1024] rounded-lg p-4">
                  <div className="h-4 bg-gray-800 rounded w-1/2 mb-3"></div>
                  <div className="h-3 bg-gray-800 rounded w-3/4 mb-4"></div>
                  <div className="h-2 bg-gray-800 rounded w-full mb-2"></div>
                  <div className="h-2 bg-gray-800 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Navbar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06060F] to-[#1a1c2f] p-4 md:p-8 pb-20">
      <div className="max-w-4xl mx-auto h-[calc(100vh-5rem)] overflow-y-auto">
        <h1 className="text-2xl font-bold text-white mb-6 sticky top-0 bg-[#06060F] z-10 py-4">
          Daily Tasks ({tasks.length})
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
          {tasks.map((task, index) => (
            <div key={index} className="bg-[#0e1024] rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                  <span className="text-2xl">🎁</span>
                </div>
                <div>
                  <h3 className="font-medium text-white">{task.details}</h3>
                  <span className="text-sm text-gray-400">{task.date}</span>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-4">
                Verify your participation to claim your points
              </p>

              <div className="my-4 bg-gradient-to-r from-[#2e3248] to-[#3a3f5a] p-2 rounded-full flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">🪙</span>
                  <span className="font-bold text-yellow-400">1,250 Coins</span>
                </div>
                <div className="h-2 w-16 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-amber-600 transition-all duration-1000" 
                    style={{ width: `${progress[index].coinWidth}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors text-sm">
                  Perform Task
                </button>
                <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors text-sm">
                  Verify
                </button>
              </div>

              <div className="mt-4 flex items-center text-sm text-gray-400">
                <span className="mr-2">🔥 XP Boost:</span>
                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-1000" 
                    style={{ width: `${progress[index].xpWidth}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Navbar />
    </div>
  );
}
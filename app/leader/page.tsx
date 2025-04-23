'use client'
import React, { useEffect, useState } from 'react'
import Navbar from 'components/ui/Navbar'

export default function Leader() {
  const [mounted, setMounted] = useState(false)
  const [xpValues, setXpValues] = useState<number[]>([])
  const [progressValues, setProgressValues] = useState<number[]>([])

  useEffect(() => {
    // Generate client-side only values
    setXpValues(Array(100).fill(0).map(() => Math.floor(Math.random() * 1000)))
    setProgressValues(Array(100).fill(0).map(() => Math.random() * 100))
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06060F] to-[#1a1c2f] p-4 md:p-8 pb-24">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -top-48 -left-48 animate-float"></div>
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-float-delayed"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
            🏆 Leaderboard
          </h1>
          <p className="text-gray-400">Top 100 Performers This Month</p>
        </div>

        {/* Scrollable Leaderboard Container */}
        <div className="bg-gradient-to-br from-[#0e1024]/90 to-[#1a1c2f]/90 rounded-2xl shadow-xl border border-white/10 backdrop-blur-lg h-[calc(100vh-220px)] overflow-y-auto">
          {/* Table Header */}
          <div className="sticky top-0 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-b border-white/10 backdrop-blur-lg z-20">
            <div className="flex font-medium text-gray-400">
              <div className="w-16">Rank</div>
              <div className="flex-1">User</div>
              <div className="w-32 text-right">Balance</div>
            </div>
          </div>

          {/* Users List */}
          <div className="divide-y divide-white/5">
            {Array.from({ length: 100 }).map((_, index) => (
              <div 
                key={index}
                className="flex items-center p-4 hover:bg-white/5 transition-all group cursor-pointer"
              >
                {/* Rank */}
                <div className="w-16 flex items-center">
                  <span className={`text-sm font-medium ${
                    index < 3 ? 'text-transparent bg-clip-text' : 'text-gray-500'
                  } ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                    index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                    index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-700' : ''
                  }`}>
                    #{index + 1}
                    {index < 3 && (
                      <span className="ml-1.5">
                        {['🥇','🥈','🥉'][index]}
                      </span>
                    )}
                  </span>
                </div>

                {/* User Info */}
                <div className="flex-1 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white font-bold mr-3">
                    {String.fromCharCode(65 + (index % 26))}
                  </div>
                  <div>
                    <div className="font-medium text-white group-hover:text-cyan-300 transition-colors">
                      user_{index + 1}
                    </div>
                    {mounted && (
                      <div className="text-xs text-gray-400">
                        Level {Math.floor(index/10 + 1)} 
                        <span className="mx-1.5">·</span>
                        {xpValues[index]} XP
                      </div>
                    )}
                  </div>
                </div>

                {/* Balance */}
                <div className="w-32 text-right">
                  <div className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                    ${(10000 - index * 100).toLocaleString()}
                  </div>
                  {mounted && (
                    <div className="text-xs text-gray-400 mt-1">
                      <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${progressValues[index]}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {!mounted && (
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-800 rounded w-1/3 mb-8"></div>
            <div className="bg-gray-800 rounded-2xl h-[500px]"></div>
          </div>
        </div>
      )}

      {/* Fixed Navbar */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(-5deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite 2s;
        }
      `}</style>
    </div>
  )
}
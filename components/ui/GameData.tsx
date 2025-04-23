'use client';

import { useState, useEffect } from "react";

interface GameDataProps {
  score: number;
  currentMoves: number;
  totalMoves: number;
}

export default function GameData({ 
  score = 0, 
  currentMoves = 0, 
  totalMoves = 30 
}: GameDataProps) {
  const [error] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [score, currentMoves]);

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 mb-6">
      <div className="relative group">
        <div className="absolute inset-0 bg-purple-500/30 blur-3xl animate-pulse"></div>
        <div className="relative flex justify-between items-center bg-gradient-to-r from-purple-500 to-pink-500 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border-2 border-purple-300 border-opacity-50 transition-transform duration-300 hover:scale-105 hover:shadow-glow">
          
          {/* Floating Emojis */}
          <div className="absolute -top-4 -left-4 text-3xl animate-bounce">🎮</div>
          <div className="absolute -top-4 -right-4 text-3xl animate-bounce delay-100">🌟</div>
          
          <div className="text-center z-10">
            <div className="text-sm text-purple-100 font-semibold mb-1">SCORE</div>
            <div className={`text-3xl font-bold bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent 
              ${isAnimating ? 'animate-pulse' : ''}`}>
              {score.toLocaleString()}
            </div>
          </div>
          
          <div className="h-8 w-1 bg-white/30 mx-4 rounded-full"></div>

          <div className="text-center z-10">
            <div className="text-sm text-purple-100 font-semibold mb-1">MOVES LEFT</div>
            <div className="text-3xl font-bold text-white flex items-center gap-2">
              <span className={`${isAnimating ? 'animate-wiggle' : ''}`}>🎯</span>
              <span className="bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent">
                {currentMoves}
              </span>
              <span className="text-white/70">/ {totalMoves}</span>
            </div>
          </div>

          {/* Animated Stars */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-yellow-300 text-xl animate-star">⭐</div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(10deg); }
          75% { transform: rotate(-10deg); }
        }
        @keyframes star {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-40px) scale(0.5); opacity: 0; }
        }
        .animate-pulse {
          animation: pulse 0.5s ease-in-out;
        }
        .animate-wiggle {
          animation: wiggle 0.6s ease-in-out;
        }
        .animate-star {
          animation: star 1s ease-out forwards;
        }
        .hover\:shadow-glow:hover {
          box-shadow: 0 0 40px rgba(168,85,247,0.3), 0 0 80px rgba(236,72,153,0.2);
        }
      `}</style>
    </div>
  );
}
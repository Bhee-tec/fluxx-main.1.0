'use client'
import React from 'react';
import Navbar from 'components/ui/Navbar';

interface ActionButton {
  label: string;
  emoji: string;
  gradient: string;
  icon: string;
}

const Wallet: React.FC = () => {
  const actionButtons: ActionButton[] = [
    { 
      label: 'Fund Wallet', 
      emoji: '💰', 
      gradient: 'from-green-400 to-blue-400',
      icon: 'M13 7h3l3 3v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6l2 2h4a1 1 0 0 1 1 1v3'
    },
    { 
      label: 'Withdraw', 
      emoji: '🎁', 
      gradient: 'from-purple-400 to-pink-400',
      icon: 'M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm6-10V4m0 2L9 7m3-3 3 3'
    },
    { 
      label: 'Tx History', 
      emoji: '📜', 
      gradient: 'from-yellow-400 to-orange-400',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06060F] to-[#1a1c2f] p-4 md:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -top-48 -left-48 animate-float"></div>
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-float-delayed"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Centered Balance Section */}
        <div className="bg-gradient-to-br from-[#3a3f5a] to-[#2e3248] rounded-2xl p-6 md:p-8 shadow-2xl mb-6 md:mb-8 border border-white/10 backdrop-blur-lg">
          <h2 className="text-xs md:text-sm text-gray-400 mb-2 text-center">Total Balance</h2>
          <div className="flex justify-center items-center min-h-[60px] md:min-h-[80px]">
            <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 text-center">
              $2,450.50
            </div>
          </div>
          <div className="mt-2 text-green-400 flex items-center justify-center">
            <span className="mr-2">🤑 Active</span>
            <span className="text-sm">Last login: 2h ago</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex md:grid md:grid-cols-3 gap-2 mb-8 overflow-x-auto pb-3 scrollbar-hide">
          {actionButtons.map((action) => (
            <button 
              key={action.label}
              className={`flex flex-col items-center p-3 md:p-4 rounded-xl transition-all duration-300 
                bg-gradient-to-br ${action.gradient}
                hover:scale-105 active:scale-95 shadow-md hover:shadow-lg min-w-[120px] md:min-w-auto group`}
            >
              <div className="w-10 h-10 mb-2 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm transition-transform group-hover:rotate-12">
                <span className="text-xl">{action.emoji}</span>
                <svg 
                  className="w-5 h-5 absolute opacity-0 group-hover:opacity-100 transition-opacity text-white"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                </svg>
              </div>
              <span className="text-xs md:text-sm font-medium text-white text-shadow">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Navbar />

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(-5deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite 2s;
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default Wallet;
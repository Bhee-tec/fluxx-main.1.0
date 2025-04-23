'use client'
import { useState } from 'react';
import { ClipboardDocumentIcon, UserGroupIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import Navbar from 'components/ui/Navbar'

interface ReferralStats {
  totalReferrals: number;
  totalEarnings: number;
  referrals: {
    id: number;
    name: string;
    date: string;
    earnings: number;
  }[];
}

export default function ReferralPage() {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const referralLink: string = "https://yourplatform.com/r/john-doe-123";

  const referralStats: ReferralStats = {
    totalReferrals: 42,
    totalEarnings: 2560.50,
    referrals: [
      { id: 1, name: "Alice Smith", date: "2024-02-15", earnings: 50 },
      { id: 2, name: "Bob Johnson", date: "2024-02-14", earnings: 30 },
      { id: 3, name: "Charlie Brown", date: "2024-02-13", earnings: 45 },
    ]
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06060F] to-[#1a1c2f] p-4 md:p-8 pb-32">
      {/* Scrollable Content Area */}
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] overflow-y-auto">
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
            🚀 Referral Program
          </h1>
          <p className="text-gray-400">Invite friends and earn awesome rewards!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#0e1024] to-[#1a1c2f] rounded-2xl p-6 border border-white/10 backdrop-blur-lg hover:shadow-2xl transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-400 to-cyan-500 rounded-xl">
                <UserGroupIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm text-gray-400">Total Referrals</h3>
                <p className="text-2xl font-bold text-green-400 animate-pulse">
                  {referralStats.totalReferrals}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0e1024] to-[#1a1c2f] rounded-2xl p-6 border border-white/10 backdrop-blur-lg hover:shadow-2xl transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl">
                <CurrencyDollarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm text-gray-400">Total Earnings</h3>
                <p className="text-2xl font-bold text-purple-400">
                  <span className="text-lg">🪙</span> {referralStats.totalEarnings.toLocaleString()} FLX
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="bg-gradient-to-br from-[#0e1024] to-[#1a1c2f] rounded-2xl p-6 mb-8 border border-white/10 backdrop-blur-lg hover:shadow-2xl transition-all">
          <h2 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center gap-2">
            <span className="text-2xl">✨</span>
            Your Magic Link
          </h2>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 p-3 bg-black/30 rounded-lg border border-white/10 truncate text-gray-300 font-mono">
              {referralLink}
            </div>
            <button
              onClick={copyToClipboard}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                isCopied 
                  ? 'bg-green-500 scale-105'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105'
              }`}
            >
              <ClipboardDocumentIcon className="w-5 h-5" />
              {isCopied ? '🎉 Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Referral List */}
        <div className="bg-gradient-to-br from-[#0e1024] to-[#1a1c2f] rounded-2xl p-6 border border-white/10 backdrop-blur-lg mb-8">
          <h2 className="text-xl font-semibold text-purple-300 mb-4 flex items-center gap-2">
            <span className="text-2xl">🌟</span>
            Recent Referrals
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-white/10">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Date Joined</th>
                  <th className="pb-3 text-right">Your Earnings</th>
                </tr>
              </thead>
              <tbody>
                {referralStats.referrals.map((referral) => (
                  <tr 
                    key={referral.id} 
                    className="border-b border-white/10 hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-4 text-white">{referral.name}</td>
                    <td className="py-4 text-gray-400">{referral.date}</td>
                    <td className="py-4 text-right font-medium text-green-400">
                      +🪙{referral.earnings} FLX
                      <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">🎁</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Fixed Navbar */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
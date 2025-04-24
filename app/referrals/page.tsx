'use client';

import { useState, useEffect } from 'react';

export default function Referral() {
const [user, setUser] = useState<{
username: string;
points: number;
referralCode: string;
} | null>(null);
const [referrals, setReferrals] = useState<{
referralCount: number;
referralPoints: number;
referredUsers: { telegramId: number; username?: string }[];
}>({
referralCount: 0,
referralPoints: 0,
referredUsers: [],
});
const [error, setError] = useState<string | null>(null);
const [isAnimatingPoints, setIsAnimatingPoints] = useState(false);
const [isAnimatingReferrals, setIsAnimatingReferrals] = useState(false);
const [copied, setCopied] = useState(false);
const telegramId = 12345; // Replace with actual user context or auth
const POLLING_INTERVAL = 5000; // Poll every 5 seconds
const REFERRAL_LINK_BASE = 'https://t.me/yourgamebot?start=';
const POINTS_PER_REFERRAL = 50; // 0.05 $FLX = 50 points (1000 points = 1 $FLX)

const fetchUserData = async () => {
try {
const response = await fetch(/api/user?telegramId=${telegramId});
if (!response.ok) {
const data = await response.json();
throw new Error(data.error || 'Failed to fetch user data');
}
const data = await response.json();
setUser(prev => {
const newUser = {
username: data.username || prev?.username || 'gamemaster',
points: data.points !== undefined ? data.points : prev?.points || 0,
referralCode: data.referralCode || prev?.referralCode || 'REF123',
};
if (
prev &&
prev.username === newUser.username &&
prev.points === newUser.points &&
prev.referralCode === newUser.referralCode
) {
return prev;
}
return newUser;
});
} catch (err) {
setError('Error fetching user data');
console.error(err);
}
};

const fetchReferralData = async () => {
try {
const response = await fetch(/api/referrals?telegramId=${telegramId});
if (!response.ok) {
const data = await response.json();
throw new Error(data.error || 'Failed to fetch referral data');
}
const data = await response.json();
setReferrals(prev => {
const newReferrals = {
referralCount: data.referrals?.length || prev.referralCount || 0,
referralPoints: data.referralPoints || prev.referralPoints || 0,
referredUsers: data.referrals || prev.referredUsers || [],
};
if (
prev.referralCount === newReferrals.referralCount &&
prev.referralPoints === newReferrals.referralPoints &&
JSON.stringify(prev.referredUsers) === JSON.stringify(newReferrals.referredUsers)
) {
return prev;
}
return newReferrals;
});
} catch (err) {
setError('Error fetching referral data');
console.error(err);
}
};

useEffect(() => {
// Initial fetches
fetchUserData();
fetchReferralData();

// Set up polling
const userInterval = setInterval(fetchUserData, POLLING_INTERVAL);
const referralInterval = setInterval(fetchReferralData, POLLING_INTERVAL);

// Clean up intervals on unmount
return () => {
clearInterval(userInterval);
clearInterval(referralInterval);
};
}, [telegramId]);

// Trigger animations for points and referrals
useEffect(() => {
setIsAnimatingPoints(true);
const timer = setTimeout(() => setIsAnimatingPoints(false), 500);
return () => clearTimeout(timer);
}, [user?.points, referrals.referralPoints]);

useEffect(() => {
setIsAnimatingReferrals(true);
const timer = setTimeout(() => setIsAnimatingReferrals(false), 500);
return () => clearTimeout(timer);
}, [referrals.referralCount]);

const handleCopy = () => {
if (user?.referralCode) {
navigator.clipboard.writeText(${REFERRAL_LINK_BASE}${user.referralCode});
setCopied(true);
setTimeout(() => setCopied(false), 2000);
}
};

const handleShare = () => {
if (user?.referralCode) {
const shareText = Join me on this fun game and earn 0.05 $FLX per referral! Use my code: ${user.referralCode} 🚀 ${REFERRAL_LINK_BASE}${user.referralCode};
if (navigator.share) {
navigator.share({
title: 'Join My Game!',
text: shareText,
}).catch(console.error);
} else {
navigator.clipboard.writeText(shareText);
alert('Referral link copied to clipboard!');
}
}
};

if (error && !user) {
return <div className="max-w-md mx-auto mt-6 mb-6 text-red-500">{error}</div>;
}

return (

<div className="max-w-md mx-auto mt-6 mb-6 p-4"> <h1 className="text-2xl font-bold text-white text-center mb-4">Refer Friends & Earn Rewards</h1> <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-6 shadow-xl relative overflow-hidden"> <div className="absolute inset-0 flex justify-center items-center pointer-events-none"> {[...Array(3)].map((_, i) => ( <div key={i} className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-float" style={{ left: `${Math.random() * 100}%`, animationDelay: `${i * 0.5}s`, }} /> ))} </div> <div className="flex flex-col gap-4 z-10"> {/* Referral Code */} <div className="flex items-center justify-between bg-white/10 rounded-lg p-3"> <span className="text-white font-semibold">Your Referral Code: {user?.referralCode || 'REF123'}</span> <button onClick={handleCopy} className="bg-yellow-400 text-purple-900 px-3 py-1 rounded-lg font-bold hover:bg-yellow-300 transition-all duration-300 animate-bounce" > {copied ? 'Copied!' : 'Copy'} </button> </div>
{/* Stats */}

<div className="grid grid-cols-2 gap-4"> <div className="text-center"> <p className="text-sm text-purple-100 font-semibold">Total Referrals</p> <p className={`text-2xl font-bold text-white ${isAnimatingReferrals ? 'animate-pulse' : ''}`}> {referrals.referralCount} </p> </div> <div className="text-center"> <p className="text-sm text-purple-100 font-semibold">Referral Points</p> <p className={`text-2xl font-bold text-yellow-300 ${isAnimatingPoints ? 'animate-pulse' : ''}`}> {(referrals.referralPoints / 1000).toFixed(2)} $FLX </p> </div> </div>
{/* Total Points */}

<div className="text-center"> <p className="text-sm text-purple-100 font-semibold">Your Balance</p> <p className={`text-2xl font-bold text-yellow-300 ${isAnimatingPoints ? 'animate-pulse' : ''}`}> {(user?.points / 1000 || 0).toFixed(2)} $FLX </p> </div>
{/* Share Button */}
<button
onClick={handleShare}
className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-400 transition-all duration-300 mt-4 animate-bounce"

Share Referral Link 🚀
</button>

</div>
 </div>
{/* Referred Users List */}
{referrals.referredUsers.length > 0 && (

<div className="mt-6"> <h2 className="text-xl font-bold text-white mb-2">Your Referrals</h2>
 <ul className="bg-white/10 rounded-lg p-4"> {referrals.referredUsers.map((ref, index) => ( <li key={index} className="text-white py-1"> @{ref.username || `User${ref.telegramId}`} </li> ))} </ul> </div> )}
{error && (

<div className="absolute top-0 left-0 right-0 bg-red-500/80 text-white text-center py-2"> {error} </div> )} <style jsx global>{` @keyframes float { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(-100px) rotate(360deg); opacity: 0; } } @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } } @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } } .animate-float { animation: float 3s linear infinite; } .animate-bounce { animation: bounce 1s infinite; } .animate-pulse { animation: pulse 0.5s ease-in-out; } `}</style> </div> 
); }
'use client'
import { useRouter, usePathname } from 'next/navigation';
import React, { JSX } from 'react';

interface NavItem {
  path: string;
  name: string;
  icon: JSX.Element;
}

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

    const navItems: NavItem[] = [
        { 
            path: '/', 
            name: 'Home', 
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/>
                </svg>
            ) 
        },
        { 
            path: '/task', 
            name: 'Tasks', 
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M9 17l-5-5 1.41-1.41L9 14.17l9.59-9.58L21 6l-12 12z"/>
                </svg>
            ) 
        },
        { 
            path: '/leader', 
            name: 'Leaders', 
            icon: (
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 4h-2V3a1 1 0 00-1-1H6a1 1 0 00-1 1v1H3a1 1 0 00-1 1v3a4 4 0 004 4h1.535a4 4 0 003.743 2.581l.722-7.581H8V8h8v2h-.3l.723 7.581A4 4 0 0019.465 12H21a4 4 0 004-4V5a1 1 0 00-1-1zM4 8V6h2v2H4z"/>
                    <path d="M12 22a1 1 0 01-.894-.553l-2-4a1 1 0 011.788-.894l2 4A1 1 0 0112 22zM12 22a1 1 0 00.894-.553l2-4a1 1 0 10-1.788-.894l-2 4A1 1 0 0012 22z"/>
                </svg>
            ) 
        },
        { 
            path: '/referrals', 
            name: 'Referrals', 
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v9m0 0l-3-3m3 3l3-3m9 3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            ) 
        },
        { 
            path: '/wallet', 
            name: 'Wallet', 
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 4h14a3 3 0 013 3v10a3 3 0 01-3 3H5a3 3 0 01-3-3V7a3 3 0 013-3zm12 4H7a1 1 0 000 2h10a1 1 0 000-2zm-4 4H7a1 1 0 000 2h6a1 1 0 000-2z"/>
                </svg>
            ) 
        }
    ];

    return (
        <nav>
            <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-t-[35px] shadow-2xl border-2 border-white/20 backdrop-blur-lg">
                <div className="flex justify-around items-center p-2 relative">
                    {/* Neon Border Effect */}
                    <div className="absolute inset-0 rounded-t-[35px] bg-gradient-to-br from-purple-400 via-blue-300 to-pink-300 blur-[15px] opacity-30 -z-10"></div>
                    
                    {navItems.map((item: NavItem) => (
                        <button 
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className={`flex flex-col items-center p-2 transition-all duration-300 group ${
                                pathname === item.path 
                                    ? 'text-yellow-300 transform scale-110'
                                    : 'text-white hover:text-yellow-200'
                            }`}
                        >
                            <div className="relative">
                                <div className={`transition-all duration-300 ${
                                    pathname === item.path 
                                        ? 'animate-float drop-shadow-[0_5px_10px_rgba(255,235,0,0.5)]'
                                        : 'group-hover:scale-110'
                                }`}>
                                    {item.icon}
                                </div>
                                {pathname === item.path && (
                                    <>
                                        <div className="absolute inset-0 bg-yellow-300/20 blur-[15px] rounded-full"></div>
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                                    </>
                                )}
                                {/* Hover Emoji */}
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-2xl">
                                    {['🏠', '📝', '🏆', '🎁', '💰'][navItems.indexOf(item)]}
                                </span>
                            </div>
                            <span className={`text-sm mt-1 font-bold transition-all ${
                                pathname === item.path 
                                    ? 'text-yellow-300 drop-shadow-[0_2px_5px_rgba(255,235,0,0.5)]'
                                    : 'text-white/80 group-hover:text-white'
                            }`}>
                                {item.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-float {
                    animation: float 2s ease-in-out infinite;
                }
                .animate-pulse {
                    animation: pulse 1.5s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </nav>
    );
}
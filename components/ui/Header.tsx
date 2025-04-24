'use client';

import { useEffect, useState } from 'react';
import { WebApp } from '@twa-dev/types'

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp
    }
  }
}

export default function Header(): React.JSX.Element {
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()

      const initData = tg.initData || ''
      const initDataUnsafe = tg.initDataUnsafe || {}

      if (initDataUnsafe.user) {
        fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(initDataUnsafe.user),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              setError(data.error)
            } else {
              setUser(data)
            }
          })
          .catch((err) => {
            setError('Failed to fetch user data')
          })
      } else {
        setError('No user data available')
      }
    } else {
      setError('This app should be opened in Telegram')
    }
  }, [])

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>
  }

  if (!user) return <div className="container mx-auto p-4">Loading...</div>

  return (
    <div className="px-2 sm:px-1">
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-stretch mt-4 mb-4">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl px-4 py-3 flex items-center flex-1 min-w-0 group relative overflow-hidden">
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl animate-bounce flex-shrink-0">⚡</span>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-white text-sm md:text-base truncate">
              {user.firstName}
              </span>
              <span className="font-bold text-yellow-300 text-sm md:text-base flex items-center truncate">
                <span className="mr-1">🪙</span>
                {balance.toFixed(2)}
                <span className="ml-1 text-purple-200">$FLX</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-float {
          animation: float 3s linear infinite;
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
      `}</style>
    </div>
  );
}

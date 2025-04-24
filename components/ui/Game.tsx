'use client';
import { useState, useEffect, useCallback } from 'react';
import GameData from 'components/ui/GameData';
import Header from 'components/ui/Header';
import { useRouter } from 'next/navigation';

const COLORS = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-orange-500'] as const;
type Color = typeof COLORS[number];

interface MatchNotification {
  id: number;
  points: number;
  x: number;
  y: number;
}

export default function Game() {
  const [tiles, setTiles] = useState<Color[]>([]);
  const [score, setScore] = useState<number>(0);
  const [moves, setMoves] = useState<number>(30);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<MatchNotification[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const telegramId = 12345; // Replace with actual telegram ID from authentication

  // Fetch the latest game state from the backend
  const fetchGameState = async () => {
    try {
      const res = await fetch(`/api/game-state?telegramId=${telegramId}`);
      if (!res.ok) throw new Error('Failed to fetch game state');
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setTiles(data.tiles);
      setScore(data.score);
      setMoves(data.moves);
    } catch (error) {
      console.error(error);
    }
  };

  // Save the current game state to the backend
  const saveGameState = async () => {
    try {
      const res = await fetch('/api/game-state', {
        method: 'POST',
        body: JSON.stringify({ telegramId, score, moves, tiles }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to save game state');
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      console.log('Game state saved:', data);
    } catch (error) {
      console.error(error);
    }
  };

  // Update the game state when score or moves change
  const updateGameState = async () => {
    try {
      const res = await fetch('/api/game-state', {
        method: 'PATCH',
        body: JSON.stringify({ telegramId, score, moves, tiles }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to update game state');
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      console.log('Game state updated:', data);
    } catch (error) {
      console.error(error);
    }
  };

  const createBoard = useCallback(() => {
    let newTiles: Color[];
    do {
      newTiles = Array.from({ length: 64 }, () => COLORS[Math.floor(Math.random() * COLORS.length)]);
    } while (findMatches(newTiles).size > 0 || !hasPossibleMoves(newTiles));

    setTiles(newTiles);
  }, []);

  useEffect(() => {
    fetchGameState();
  }, []);

  useEffect(() => {
    if (score > 0 || moves !== 30 || tiles.length) {
      updateGameState();
    }
  }, [score, moves, tiles]);

  const handleTileClick = (index: number) => {
    if (isProcessing || moves <= 0) return;

    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      if (checkValidSwap(selectedIndex, index)) {
        swapTiles(selectedIndex, index);
      }
      setSelectedIndex(null);
    }
  };

  const checkValidSwap = (index1: number, index2: number) => {
    const row1 = Math.floor(index1 / 8);
    const col1 = index1 % 8;
    const row2 = Math.floor(index2 / 8);
    const col2 = index2 % 8;
    return (
      (Math.abs(row1 - row2) === 1 && col1 === col2) || 
      (Math.abs(col1 - col2) === 1 && row1 === row2)
    );
  };

  const swapTiles = async (index1: number, index2: number) => {
    setIsProcessing(true);
    setMoves(m => m - 1);

    // Perform swap
    const newTiles = [...tiles];
    [newTiles[index1], newTiles[index2]] = [newTiles[index2], newTiles[index1]];
    setTiles(newTiles);

    await new Promise(resolve => setTimeout(resolve, 300));

    const matches = findMatches(newTiles);
    if (matches.size > 0) {
      await handleMatches(matches);
    } else {
      // Revert swap
      [newTiles[index1], newTiles[index2]] = [newTiles[index2], newTiles[index1]];
      setTiles([...newTiles]);
    }

    setIsProcessing(false);
  };

  const findMatches = (tileArray: Color[]) => {
    const matched = new Set<number>();

    // Horizontal matches
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 6; col++) {
        const index = row * 8 + col;
        if (
          tileArray[index] &&
          tileArray[index] === tileArray[index + 1] &&
          tileArray[index] === tileArray[index + 2]
        ) {
          matched.add(index);
          matched.add(index + 1);
          matched.add(index + 2);
        }
      }
    }

    // Vertical matches
    for (let col = 0; col < 8; col++) {
      for (let row = 0; row < 6; row++) {
        const index = row * 8 + col;
        if (
          tileArray[index] &&
          tileArray[index] === tileArray[index + 8] &&
          tileArray[index] === tileArray[index + 16]
        ) {
          matched.add(index);
          matched.add(index + 8);
          matched.add(index + 16);
        }
      }
    }
    return matched;
  };

  const handleMatches = async (matched: Set<number>) => {
    const pointsEarned = matched.size * 5;
    setScore(s => s + pointsEarned);

    // Show notification
    const firstIndex = Array.from(matched)[0];
    const tileElement = document.getElementById(`tile-${firstIndex}`);
    if (tileElement) {
      const rect = tileElement.getBoundingClientRect();
      setNotifications(prev => [
        ...prev,
        {
          id: Date.now(),
          points: pointsEarned,
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        },
      ]);
    }

    // Update tiles
    const newTiles = tiles.map((color, index) =>
      matched.has(index) ? COLORS[Math.floor(Math.random() * COLORS.length)] : color
    );
    setTiles(newTiles);

    // Check for new matches
    await new Promise(resolve => setTimeout(resolve, 300));
    const newMatches = findMatches(newTiles);
    if (newMatches.size > 0) {
      await handleMatches(newMatches);
    }
  };

  const hasPossibleMoves = (tileArray: Color[]) => {
    for (let i = 0; i < tileArray.length; i++) {
      if (i % 8 < 7 && testSwap(i, i + 1, tileArray)) return true;
      if (i < 56 && testSwap(i, i + 8, tileArray)) return true;
    }
    return false;
  };

  const testSwap = (a: number, b: number, arr: Color[]) => {
    const temp = [...arr];
    [temp[a], temp[b]] = [temp[b], temp[a]];
    return findMatches(temp).size > 0;
  };

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  return (
    <div className="max-w-md mx-auto mt-6 mb-6 pb-60 relative">
      <Header />
      <GameData score={score} currentMoves={moves} totalMoves={30} />

      <div className="grid grid-cols-8 gap-1 bg-white p-2 rounded-xl shadow-xl touch-pan-y">
        {tiles.map((color, index) => (
          <button
            key={index}
            id={`tile-${index}`}
            onClick={() => handleTileClick(index)}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleTileClick(index);
            }}
            disabled={isProcessing || moves <= 0}
            className={`aspect-square rounded-lg transition-all duration-300 ${color}
              ${selectedIndex === index ? 'ring-4 ring-white scale-110' : ''} 
              ${isProcessing || moves <= 0 ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
            style={{
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
          />
        ))}
      </div>

      {notifications.map(({ id, points, x, y }) => (
        <div
          key={id}
          className="fixed text-yellow-400 font-bold text-lg animate-float pointer-events-none"
          style={{
            left: `${x}px`,
            top: `${y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          +{points}
          <div className="absolute inset-0 w-full h-full"></div>
        </div>
      ))}
    </div>
  );
}

'use client';
import { useState, useEffect, useCallback } from 'react';
import GameData from 'components/ui/GameData';
import Header from 'components/ui/Header';

const COLORS = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-orange-500'] as const;
type Color = typeof COLORS[number];

interface MatchNotification {
  id: number;
  points: number;
  x: number;
  y: number;
}

interface GameState {
  tiles: Color[];
  score: number;
  moves: number;
}

export default function Game() {
  const [tiles, setTiles] = useState<Color[]>([]);
  const [score, setScore] = useState<number>(0);
  const [moves, setMoves] = useState<number>(30);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<MatchNotification[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const telegramId = "123456"; // Replace with actual Telegram ID (e.g., from auth context)

  const createBoard = useCallback(() => {
    let newTiles: Color[];
    do {
      newTiles = Array.from({ length: 64 }, () => COLORS[Math.floor(Math.random() * COLORS.length)]);
    } while (findMatches(newTiles).size > 0 || !hasPossibleMoves(newTiles));
    return newTiles;
  }, []);

  const fetchGameState = useCallback(async (retryCount = 3) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/game-state?telegramId=${telegramId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch game state: ${response.status}`);
      }
      const data: GameState = await response.json();
      if (!data.tiles || !Array.isArray(data.tiles) || data.tiles.length !== 64) {
        throw new Error('Invalid game state data');
      }
      setTiles(data.tiles);
      setScore(data.score);
      setMoves(data.moves);
    } catch (err) {
      // Narrow the type of err to Error
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Fetch game state error:', err);
      if (retryCount > 0) {
        console.log(`Retrying fetch... (${retryCount} attempts left)`);
        setTimeout(() => fetchGameState(retryCount - 1), 2000);
        return;
      }
      setError(`${errorMessage}. Starting new game.`);
      const newTiles = createBoard();
      setTiles(newTiles);
      await saveGameState({ tiles: newTiles, score: 0, moves: 30 }, true);
    } finally {
      setIsLoading(false);
    }
  }, [createBoard, telegramId]);

  const saveGameState = async (state: GameState, isNewGame = false) => {
    try {
      const method = isNewGame ? 'POST' : 'PATCH';
      const response = await fetch('/api/game-state', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId, ...state }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isNewGame ? 'create' : 'save'} game state`);
      }
    } catch (err) {
      // Narrow the type of err to Error
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Save game state error:', err);
      setError(errorMessage || `Failed to ${isNewGame ? 'create' : 'save'} game state.`);
    }
  };

  const resetGame = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newTiles = createBoard();
      await saveGameState({ tiles: newTiles, score: 0, moves: 30 }, true);
      setTiles(newTiles);
      setScore(0);
      setMoves(30);
    } catch (err) {
      // Narrow the type of err to Error
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Reset game error:', err);
      setError(errorMessage || 'Failed to reset game.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGameState();
    const interval = setInterval(() => setMoves(30), 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchGameState]);

  const handleTileClick = (index: number) => {
    if (isProcessing || moves <= 0 || isLoading) return;

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

    const newTiles = [...tiles];
    [newTiles[index1], newTiles[index2]] = [newTiles[index2], newTiles[index1]];
    setTiles(newTiles);

    await new Promise(resolve => setTimeout(resolve, 300));

    const matches = findMatches(newTiles);
    if (matches.size > 0) {
      await handleMatches(matches);
      await saveGameState({ tiles: newTiles, score, moves: moves - 1 });
    } else {
      [newTiles[index1], newTiles[index2]] = [newTiles[index2], newTiles[index1]];
      setTiles([...newTiles]);
      setMoves(m => m + 1);
    }

    setIsProcessing(false);
  };

  const findMatches = (tileArray: Color[]) => {
    const matched = new Set<number>();

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

    const newTiles = tiles.map((color, index) =>
      matched.has(index) ? COLORS[Math.floor(Math.random() * COLORS.length)] : color
    );
    setTiles(newTiles);

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
      <Header score={score} />
      <GameData score={score} currentMoves={moves} totalMoves={30} />
      {isLoading && <div className="text-blue-500 mb-2">Loading game data...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button
        onClick={resetGame}
        disabled={isLoading}
        className={`mb-4 px-4 py-2 text-white rounded ${
          isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        Reset Game
      </button>
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
            disabled={isProcessing || moves <= 0 || isLoading}
            className={`aspect-square rounded-lg transition-all duration-300 ${color}
              ${selectedIndex === index ? 'ring-4 ring-white scale-110' : ''}
              ${isProcessing || moves <= 0 || isLoading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
            style={{
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
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
          <div className="absolute inset-0 bg-yellow-400/20 blur-sm rounded-full -z-10" />
        </div>
      ))}

      <style jsx global>{`
        @keyframes float {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-50px); }
        }
        .animate-float {
          animation: float 1s ease-out forwards;
        }
        html {
          touch-action: manipulation;
          overflow: hidden;
        }
        body {
          overscroll-behavior: none;
          -webkit-overflow-scrolling: touch;
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
}
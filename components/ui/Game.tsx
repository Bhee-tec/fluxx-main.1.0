'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';

interface GameState {
  tiles: string[];
  score: number;
  moves: number;
}

const telegramId = 123456789; // Replace with dynamic ID from context/session

const generateInitialTiles = (): string[] => {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
  return Array.from({ length: 36 }, () => colors[Math.floor(Math.random() * colors.length)]);
};

export default function Game() {
  const [tiles, setTiles] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(30);

  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const { data } = await axios.get(`/api/game-state?telegramId=${telegramId}`);
        setTiles(data.tiles);
        setScore(data.score);
        setMoves(data.moves);
      } catch (err: any) {
        if (err.response?.status === 404) {
          const newTiles = generateInitialTiles();
          await axios.post('/api/game-state', {
            telegramId,
            score: 0,
            moves: 30,
            tiles: newTiles,
          });
          setTiles(newTiles);
        } else {
          console.error('Failed to fetch game state:', err);
        }
      }
    };

    fetchGameState();
  }, []);

  const updateGameState = async (newScore: number, newMoves: number, newTiles: string[]) => {
    try {
      await axios.patch('/api/game-state', {
        telegramId,
        score: newScore,
        moves: newMoves,
        tiles: newTiles,
      });
    } catch (err) {
      console.error('Failed to update game state:', err);
    }
  };

  const handleMatch = (matchedIndices: number[]) => {
    if (moves <= 0) return;

    const newTiles = [...tiles];
    matchedIndices.forEach(index => {
      newTiles[index] = ['red', 'blue', 'green', 'yellow', 'purple'][Math.floor(Math.random() * 5)];
    });

    const earned = matchedIndices.length * 10;
    const newScore = score + earned;
    const newMoves = moves - 1;

    setTiles(newTiles);
    setScore(newScore);
    setMoves(newMoves);
    updateGameState(newScore, newMoves, newTiles);
  };

  const handleTileClick = (index: number) => {
    // Swap logic or selection logic can go here
    // For now, we simulate a match when a tile is clicked
    handleMatch([index, index + 1, index + 2]);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Match-3 Game</h1>
      <div className="mb-2">Score: {score}</div>
      <div className="mb-2">Moves left: {moves}</div>
      <div className="grid grid-cols-6 gap-2">
        {tiles.map((tile, index) => (
          <div
            key={index}
            className={`w-12 h-12 rounded shadow-md cursor-pointer bg-${tile}-500`}
            onClick={() => handleTileClick(index)}
          ></div>
        ))}
      </div>
    </div>
  );
}

import React from 'react'
import Navbar from 'components/ui/Navbar';
import Game from 'components/ui/Game';
import Gamedata from 'components/ui/GameData';

export default function page() {
  return (
    <div className="flex flex-col min-h-screen  bg-[#06060F] text-white p-4 font-sans">
  <div className="max-h-fit bg-gradient-to-br p-4">
  <Game />
  </div>
      <Navbar />
</div>
  )
}

import React from 'react';
import logoImg from '../../assets/logo.jpg';

export const CoinLogo = ({
  size = 'w-16 h-16',
  className = '',
  ringClass = 'border-2 border-white/90 shadow-2xl shadow-blue-500/50 ring-4 ring-blue-500/30',
  autoSpin = true
}) => {
  return (
    <div className={`coin-wrapper ${size} relative cursor-pointer select-none group ${className}`} title="Team Bellas Artes Bots">
      <div className={`coin-inner ${autoSpin ? 'animate-coin-spin' : ''}`}>
        {/* Cara frontal */}
        <div className={`coin-face coin-front ${ringClass} rounded-full`}>
          <img
            src={logoImg}
            alt="Team Bellas Artes Bots"
            className="w-full h-full rounded-full object-cover pointer-events-none"
          />
          <div className="coin-shine" />
        </div>

        {/* Cara trasera (orientada correctamente en 180deg) */}
        <div className={`coin-face coin-back ${ringClass} rounded-full`}>
          <img
            src={logoImg}
            alt="Team Bellas Artes Bots"
            className="w-full h-full rounded-full object-cover pointer-events-none"
          />
          <div className="coin-shine" />
        </div>
      </div>
    </div>
  );
};

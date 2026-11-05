import React from 'react';
import logoImg from '../../assets/logo.jpg';

export const CoinLogo = ({
  size = 'w-16 h-16',
  className = '',
  ringClass = 'border-2 border-white/80 shadow-2xl shadow-blue-500/40 ring-4 ring-blue-500/30',
  autoSpin = true
}) => {
  return (
    <div className={`coin-wrapper ${size} relative cursor-pointer select-none group ${className}`} title="Team Bellas Artes Bots">
      <div className={`coin-inner ${autoSpin ? 'animate-coin-spin' : ''}`}>
        {/* Cara frontal */}
        <div className={`coin-face coin-front ${ringClass}`}>
          <img
            src={logoImg}
            alt="Team Bellas Artes Bots"
            className="w-full h-full object-cover pointer-events-none"
          />
          <div className="coin-shine" />
        </div>

        {/* Cara trasera (refleja la misma imagen pero orientada correctamente sin espejo) */}
        <div className={`coin-face coin-back ${ringClass}`}>
          <img
            src={logoImg}
            alt="Team Bellas Artes Bots"
            className="w-full h-full object-cover pointer-events-none"
          />
          <div className="coin-shine" />
        </div>
      </div>
    </div>
  );
};

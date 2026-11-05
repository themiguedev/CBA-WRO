import React from 'react';
import logoImg from '../../assets/logo.jpg';

export const CoinLogo = ({
  size = 'w-16 h-16',
  className = '',
  ringClass = 'border-2 border-white/90 shadow-2xl shadow-blue-500/50 ring-4 ring-blue-500/30',
  autoSpin = true
}) => {
  return (
    <div
      className={`coin-wrapper ${size} relative cursor-pointer select-none group ${className}`}
      title="Team Bellas Artes Bots"
      style={{ perspective: '1000px' }}
    >
      <style>{`
        @keyframes coinSpinDirect {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes coinGlint {
          0% { background-position: -200% 0; opacity: 0; }
          25%, 35% { opacity: 0.85; }
          50% { background-position: 200% 0; opacity: 0; }
          75%, 85% { opacity: 0.85; }
          100% { background-position: 200% 0; opacity: 0; }
        }
        .coin-spinning-active {
          animation: coinSpinDirect 3s linear infinite !important;
          transform-style: preserve-3d !important;
          -webkit-transform-style: preserve-3d !important;
          will-change: transform;
        }
        .coin-spinning-active:hover {
          animation-duration: 1.2s !important;
        }
      `}</style>
      <div
        className={`coin-inner w-full h-full ${autoSpin ? 'coin-spinning-active' : ''}`}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Cara frontal */}
        <div
          className={`coin-face coin-front ${ringClass} rounded-full`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)'
          }}
        >
          <img
            src={logoImg}
            alt="Team Bellas Artes Bots"
            className="w-full h-full rounded-full object-cover pointer-events-none"
          />
          <div className="coin-shine" />
        </div>

        {/* Cara trasera (orientada correctamente en 180deg) */}
        <div
          className={`coin-face coin-back ${ringClass} rounded-full`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
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

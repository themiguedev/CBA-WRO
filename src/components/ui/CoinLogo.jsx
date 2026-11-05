import React from 'react';
import logoImg from '../../assets/logo.jpg';

const EDGE_LAYERS = [-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5];

export const CoinLogo = ({
  size = 'w-16 h-16',
  className = '',
  ringClass = 'border-2 border-white/90 shadow-2xl shadow-blue-500/50 ring-4 ring-blue-500/30',
  autoSpin = true,
  showShadow = true
}) => {
  return (
    <div
      className={`coin-3d-root relative inline-flex flex-col items-center select-none cursor-pointer group ${className}`}
      title="Team Bellas Artes Bots"
    >
      <style>{`
        @keyframes coinSpin3D {
          0% {
            transform: rotateY(0deg) rotateX(14deg);
          }
          25% {
            transform: rotateY(90deg) rotateX(6deg);
          }
          50% {
            transform: rotateY(180deg) rotateX(14deg);
          }
          75% {
            transform: rotateY(270deg) rotateX(6deg);
          }
          100% {
            transform: rotateY(360deg) rotateX(14deg);
          }
        }

        @keyframes coinFloat3D {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes coinShadowPulse {
          0%, 50%, 100% {
            transform: scaleX(1) scaleY(1);
            opacity: 0.55;
          }
          25%, 75% {
            transform: scaleX(0.35) scaleY(0.7);
            opacity: 0.25;
          }
        }

        @keyframes coinShinePass {
          0% {
            background-position: -200% 0;
            opacity: 0;
          }
          20%, 35% {
            opacity: 0.95;
          }
          50% {
            background-position: 200% 0;
            opacity: 0;
          }
          70%, 85% {
            opacity: 0.95;
          }
          100% {
            background-position: 200% 0;
            opacity: 0;
          }
        }

        .coin-spinning-3d {
          animation: coinSpin3D 3.2s linear infinite !important;
          transform-style: preserve-3d !important;
          -webkit-transform-style: preserve-3d !important;
          will-change: transform;
        }

        .coin-spinning-3d:hover {
          animation-duration: 1.4s !important;
        }

        .coin-floating-3d {
          animation: coinFloat3D 3.2s ease-in-out infinite;
        }

        .coin-shadow-3d {
          animation: coinShadowPulse 3.2s linear infinite;
        }
      `}</style>

      {/* Contenedor con Perspectiva 3D */}
      <div
        className={`coin-wrapper ${size} relative ${autoSpin ? 'coin-floating-3d' : ''}`}
        style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
      >
        {/* Moneda 3D con Espesor Físico */}
        <div
          className={`coin-inner w-full h-full relative ${autoSpin ? 'coin-spinning-3d' : ''}`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Capas intermedias que construyen el canto/espesor tridimensional de la moneda */}
          {EDGE_LAYERS.map((z, idx) => (
            <div
              key={idx}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                transform: `translateZ(${z}px)`,
                border: '2.5px solid rgba(191, 219, 254, 0.95)',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 35%, #bfdbfe 50%, #2563eb 65%, #172554 100%)',
                boxShadow: 'inset 0 0 3px rgba(0, 0, 0, 0.55)'
              }}
            />
          ))}

          {/* Cara Frontal con Bisel 3D */}
          <div
            className={`coin-face coin-front ${ringClass} rounded-full overflow-hidden`}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(4.5px)',
              boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.7), inset 0 0 8px rgba(0,0,0,0.4), 0 0 20px rgba(59,130,246,0.4)'
            }}
          >
            <img
              src={logoImg}
              alt="Team Bellas Artes Bots"
              className="w-full h-full rounded-full object-cover pointer-events-none"
            />
            {/* Destello reflectante */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.4) 47%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.4) 53%, transparent 70%)',
                backgroundSize: '200% 200%',
                animation: 'coinShinePass 3.2s linear infinite'
              }}
            />
          </div>

          {/* Cara Trasera con Bisel 3D (orientada hacia el espectador al dar la vuelta) */}
          <div
            className={`coin-face coin-back ${ringClass} rounded-full overflow-hidden`}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg) translateZ(4.5px)',
              boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.7), inset 0 0 8px rgba(0,0,0,0.4), 0 0 20px rgba(59,130,246,0.4)'
            }}
          >
            <img
              src={logoImg}
              alt="Team Bellas Artes Bots"
              className="w-full h-full rounded-full object-cover pointer-events-none"
            />
            {/* Destello reflectante */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.4) 47%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.4) 53%, transparent 70%)',
                backgroundSize: '200% 200%',
                animation: 'coinShinePass 3.2s linear infinite'
              }}
            />
          </div>
        </div>
      </div>

      {/* Sombra 3D inferior que acompaña el espesor y rotación */}
      {showShadow && (
        <div
          className="coin-shadow-3d h-1.5 w-10 sm:w-12 bg-blue-950/80 rounded-full blur-[2px] mt-1 pointer-events-none"
        />
      )}
    </div>
  );
};

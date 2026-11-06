import React from 'react';
import logoImg from '../../assets/logo.jpg';

// 17 micro-capas (~0.4px de separación) para construir un canto metálico continuo y cilíndrico
const THICKNESS_HALF = 3.2; // 6.4px de espesor físico total de la moneda
const NUM_STEPS = 17;
const EDGE_LAYERS = Array.from({ length: NUM_STEPS }, (_, i) => {
  const z = -THICKNESS_HALF + i * ((2 * THICKNESS_HALF) / (NUM_STEPS - 1));
  const ratio = Math.abs(z) / THICKNESS_HALF;
  const alpha = Math.max(0.4, 0.85 - 0.45 * ratio);
  return {
    z: Number(z.toFixed(2)),
    borderColor: `rgba(147, 197, 253, ${alpha.toFixed(2)})`
  };
});

export const CoinLogo = ({
  size = 'w-16 h-16',
  className = '',
  ringClass = 'border-2 border-white/95 shadow-2xl shadow-blue-500/50 ring-4 ring-blue-500/30',
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
            transform: rotateY(0deg) rotateX(9deg);
          }
          100% {
            transform: rotateY(360deg) rotateX(9deg);
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
            opacity: 0.6;
          }
          25%, 75% {
            transform: scaleX(0.35) scaleY(0.75);
            opacity: 0.25;
          }
        }

        @keyframes coinGlintSweep {
          0% {
            transform: translateX(-150%) skewX(-25deg);
            opacity: 0;
          }
          15%, 35% {
            opacity: 0.4;
          }
          55%, 100% {
            transform: translateX(150%) skewX(-25deg);
            opacity: 0;
          }
        }

        .coin-spinning-3d {
          animation: coinSpin3D 3.8s linear infinite !important;
          transform-style: preserve-3d !important;
          -webkit-transform-style: preserve-3d !important;
          will-change: transform;
        }

        .coin-floating-3d {
          animation: coinFloat3D 3.8s ease-in-out infinite;
        }

        .coin-shadow-3d {
          animation: coinShadowPulse 3.8s linear infinite;
        }

        .coin-3d-root {
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .coin-3d-root:hover {
          transform: translateY(-4px) scale(1.08);
        }

        .coin-3d-root:hover .coin-face-glow {
          opacity: 0.9;
        }
      `}</style>

      {/* Contenedor con Perspectiva 3D */}
      <div
        className={`coin-wrapper ${size} relative ${autoSpin ? 'coin-floating-3d' : ''}`}
        style={{ perspective: '1200px', WebkitPerspective: '1200px', transformStyle: 'preserve-3d' }}
      >
        {/* Moneda 3D con Canto Metálico Cilíndrico Continuo */}
        <div
          className={`coin-inner w-full h-full relative ${autoSpin ? 'coin-spinning-3d' : ''}`}
          style={{ transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' }}
        >
          {/* Micro-capas cilíndricas del canto (espesor sólido y continuo sin saltos de sierra) */}
          {EDGE_LAYERS.map((layer, idx) => (
            <div
              key={idx}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                transform: `translateZ(${layer.z}px)`,
                WebkitTransform: `translateZ(${layer.z}px)`,
                background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #1e3a8a 100%)',
                border: `1.2px solid ${layer.borderColor}`
              }}
            />
          ))}

          {/* Cara Frontal (con relieve 3D y brillo controlado) */}
          <div
            className={`coin-face coin-face-front ${ringClass} rounded-full`}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              borderRadius: '9999px',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: `translateZ(${(THICKNESS_HALF + 0.18).toFixed(2)}px)`,
              WebkitTransform: `translateZ(${(THICKNESS_HALF + 0.18).toFixed(2)}px)`,
              boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.95), 0 0 16px rgba(37, 99, 235, 0.45)',
              background: '#0f172a'
            }}
          >
            <img
              src={logoImg}
              alt="Team Bellas Artes Bots"
              className="w-full h-full rounded-full object-cover pointer-events-none select-none block"
            />
            {/* Resplandor metálico sutil no invasivo */}
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div
                className="absolute -top-1/2 left-0 w-2/3 h-[200%]"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)',
                  animation: 'coinGlintSweep 3.8s ease-in-out infinite'
                }}
              />
            </div>
            {/* Halo de realce interactivo */}
            <div className="coin-face-glow absolute inset-0 rounded-full ring-2 ring-blue-400/60 opacity-0 transition-opacity duration-300 pointer-events-none" />
          </div>

          {/* Cara Trasera (perfectamente orientada, NO espejo, nítida y simétrica) */}
          <div
            className={`coin-face coin-face-back ${ringClass} rounded-full`}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              borderRadius: '9999px',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: `rotateY(180deg) translateZ(${(THICKNESS_HALF + 0.18).toFixed(2)}px)`,
              WebkitTransform: `rotateY(180deg) translateZ(${(THICKNESS_HALF + 0.18).toFixed(2)}px)`,
              boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.95), 0 0 16px rgba(37, 99, 235, 0.45)',
              background: '#0f172a'
            }}
          >
            <img
              src={logoImg}
              alt="Team Bellas Artes Bots"
              className="w-full h-full rounded-full object-cover pointer-events-none select-none block"
            />
            {/* Resplandor metálico sutil no invasivo */}
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div
                className="absolute -top-1/2 left-0 w-2/3 h-[200%]"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)',
                  animation: 'coinGlintSweep 3.8s ease-in-out infinite'
                }}
              />
            </div>
            {/* Halo de realce interactivo */}
            <div className="coin-face-glow absolute inset-0 rounded-full ring-2 ring-blue-400/60 opacity-0 transition-opacity duration-300 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Sombra 3D sincronizada en profundidad y perspectiva */}
      {showShadow && (
        <div
          className="coin-shadow-3d h-1.5 w-10 sm:w-12 bg-blue-950/80 rounded-full blur-[2px] mt-1.5 pointer-events-none"
        />
      )}
    </div>
  );
};

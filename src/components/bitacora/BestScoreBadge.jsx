import React from 'react';
import { Trophy, Clock, Bot, Calendar, Sparkles, Award } from 'lucide-react';

export const BestScoreBadge = ({ best, teamName, categoryName }) => {
  if (!best) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center">
        <Trophy className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-slate-300">Aún no hay rondas registradas</h4>
        <p className="text-xs text-slate-500 mt-1">
          Las mejores puntuaciones se calcularán automáticamente al cargar la primera bitácora.
        </p>
      </div>
    );
  }

  const isRegional = best.tipoEvento === 'regional';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 shadow-xl">
      {/* Glow ambiental */}
      <div
        className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none ${
          isRegional ? 'bg-amber-400' : 'bg-cyan-400'
        }`}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${
                isRegional
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
              }`}
            >
              {isRegional ? (
                <>
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Récord en Regional WRO
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Récord en Entrenamiento / Práctica
                </>
              )}
            </span>

            {categoryName && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                Cat: {categoryName}
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            Mejor Resultado: <span className="text-blue-400">{teamName}</span>
          </h3>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
            <span className="flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-slate-500" />
              Robot: <strong className="text-slate-200">{best.robot || 'Prototipo'}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Fecha: <strong className="text-slate-200">{best.fecha}</strong>
            </span>
            <span>
              Ronda: <strong className="text-slate-200">#{best.numeroRonda}</strong>
            </span>
            {best.semana && (
              <span>
                Semana: <strong className="text-slate-200">{best.semana}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Métricas destacadas */}
        <div className="flex items-center gap-4 sm:gap-6 self-start md:self-auto bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          {/* Puntaje */}
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">Puntaje</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                {best.puntaje}
              </span>
              <span className="text-xs text-slate-500 font-bold">pts</span>
            </div>
          </div>

          <div className="h-10 w-[1px] bg-slate-800" />

          {/* Tiempo (Criterio de desempate) */}
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              Tiempo
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {best.tiempo}
              </span>
              <span className="text-xs text-slate-500 font-medium">min</span>
            </div>
          </div>
        </div>
      </div>

      {best.observaciones && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
          <span className="font-semibold text-slate-400">Observaciones técnicas de esta ronda: </span>
          <span className="italic">"{best.observaciones}"</span>
        </div>
      )}
    </div>
  );
};

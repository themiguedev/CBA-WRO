import React from 'react';
import { Trophy, Clock, Bot, Calendar, Sparkles, Award, Zap, Activity } from 'lucide-react';

export const BestScoreBadge = ({ best, teamName, categoryName }) => {
  if (!best) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center animate-fadeIn">
        <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-3 shadow-inner">
          <Trophy className="w-6 h-6 text-slate-600" />
        </div>
        <h4 className="text-sm font-bold text-slate-300">Aún no hay rondas registradas</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          El récord del equipo y la mejor ronda se calcularán automáticamente al cargar la primera bitácora técnica de 10 rondas.
        </p>
      </div>
    );
  }

  const isRegional = best.tipoEvento === 'regional';
  const scorePct = Math.min(100, ((parseFloat(best.puntaje) || 0) / 120) * 100);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-7 shadow-2xl animate-fadeIn">
      {/* Glow ambiental pulsante */}
      <div
        className={`absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-25 pointer-events-none ${
          isRegional ? 'bg-amber-400' : 'bg-cyan-400'
        }`}
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm ${
                isRegional
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-amber-500/10'
                  : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-cyan-500/10'
              }`}
            >
              {isRegional ? (
                <>
                  <Award className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
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
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
                Categoría: {categoryName}
              </span>
            )}
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Récord Histórico:</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              {teamName}
            </span>
          </h3>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2.5">
            <span className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              <Bot className="w-3.5 h-3.5 text-blue-400" />
              Robot: <strong className="text-slate-200">{best.robot || 'Prototipo'}</strong>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Fecha: <strong className="text-slate-200">{best.fecha}</strong>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              Ronda: <strong className="text-slate-200">#{best.numeroRonda}</strong>
            </span>
            {best.semana && (
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                Semana: <strong className="text-slate-200">{best.semana}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Telemetría Destacada (Puntaje & Tiempo) */}
        <div className="flex items-center gap-4 sm:gap-6 bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-slate-800/90 shadow-xl self-start lg:self-auto">
          {/* Puntaje */}
          <div>
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> Puntaje
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
                {best.puntaje}
              </span>
              <span className="text-xs text-slate-500 font-bold">/120 pts</span>
            </div>
            {/* Barra mini */}
            <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                style={{ width: `${scorePct}%` }}
              />
            </div>
          </div>

          <div className="h-12 w-[1px] bg-slate-800" />

          {/* Tiempo Desempate */}
          <div>
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" /> Tiempo Desempate
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-cyan-300">
                {best.tiempo}
              </span>
              <span className="text-xs text-slate-500 font-medium">min</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-2 font-mono">
              Efectividad: <strong className="text-slate-300">{scorePct.toFixed(0)}%</strong>
            </div>
          </div>
        </div>
      </div>

      {best.observaciones && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-300 flex items-start gap-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800/40">
          <span className="font-bold text-slate-400 whitespace-nowrap">Nota de Ingeniería:</span>
          <span className="italic text-slate-300">"{best.observaciones}"</span>
        </div>
      )}
    </div>
  );
};

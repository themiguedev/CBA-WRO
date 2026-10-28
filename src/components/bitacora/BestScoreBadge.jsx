import React from 'react';
import { Trophy, Clock, Bot, Calendar, Sparkles, Award, Zap, Activity } from 'lucide-react';

export const BestScoreBadge = ({ best, teamName, categoryName }) => {
  if (!best) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center animate-fadeIn bg-white border border-slate-200 shadow-sm">
        <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-3 text-blue-600 shadow-inner">
          <Trophy className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-900">Aún no hay rondas registradas</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          El récord del equipo y la mejor ronda se calcularán automáticamente al cargar la primera bitácora técnica de 10 rondas.
        </p>
      </div>
    );
  }

  const isRegional = best.tipoEvento === 'regional';
  const scorePct = Math.min(100, ((parseFloat(best.puntaje) || 0) / 120) * 100);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/40 p-6 sm:p-7 shadow-md animate-fadeIn">
      {/* Glow sutil */}
      <div
        className={`absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none ${
          isRegional ? 'bg-amber-300' : 'bg-blue-300'
        }`}
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm ${
                isRegional
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-amber-100'
                  : 'bg-blue-100 text-blue-900 border-blue-300 shadow-blue-100'
              }`}
            >
              {isRegional ? (
                <>
                  <Award className="w-3.5 h-3.5 text-amber-700 animate-bounce" />
                  Récord en Regional WRO
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                  Récord en Entrenamiento / Práctica
                </>
              )}
            </span>

            {categoryName && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 font-bold shadow-sm">
                Categoría: {categoryName}
              </span>
            )}
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Récord Histórico:</span>
            <span className="text-blue-700">
              {teamName}
            </span>
          </h3>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700 mt-3 font-medium">
            <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
              <Bot className="w-3.5 h-3.5 text-blue-600" />
              Robot: <strong className="text-slate-900">{best.robot || 'Prototipo'}</strong>
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Fecha: <strong className="text-slate-900">{best.fecha}</strong>
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
              <Activity className="w-3.5 h-3.5 text-amber-600" />
              Ronda: <strong className="text-slate-900">#{best.numeroRonda}</strong>
            </span>
            {best.semana && (
              <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
                Semana: <strong className="text-slate-900">{best.semana}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Telemetría Destacada (Puntaje & Tiempo) */}
        <div className="flex items-center gap-4 sm:gap-6 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-md self-start lg:self-auto">
          {/* Puntaje */}
          <div>
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-600" /> Puntaje WRO
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl sm:text-4xl font-black text-amber-600">
                {best.puntaje}
              </span>
              <span className="text-xs text-slate-500 font-bold">/120 pts</span>
            </div>
            {/* Barra mini */}
            <div className="w-24 h-2 bg-slate-100 rounded-full mt-2 overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                style={{ width: `${scorePct}%` }}
              />
            </div>
          </div>

          <div className="h-12 w-[1px] bg-slate-200" />

          {/* Tiempo Desempate */}
          <div>
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-600" /> Tiempo Desempate
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
                {best.tiempo}
              </span>
              <span className="text-xs text-slate-500 font-medium">min</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-2 font-mono">
              Efectividad: <strong className="text-blue-700">{scorePct.toFixed(0)}%</strong>
            </div>
          </div>
        </div>
      </div>

      {best.observaciones && (
        <div className="mt-4 pt-4 border-t border-slate-200/90 text-xs text-slate-800 flex items-start gap-2 bg-white/80 p-3 rounded-xl border border-slate-200 shadow-sm">
          <span className="font-extrabold text-slate-900 whitespace-nowrap">Nota de Ingeniería:</span>
          <span className="italic text-slate-700">"{best.observaciones}"</span>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { getRankingByCategory, getCategories } from '../../services/storageService';
import {
  Trophy,
  Clock,
  Sparkles,
  Award,
  Bot,
  Crown
} from 'lucide-react';

export const CategoryRankingTable = ({ userTeamId = null }) => {
  const categories = getCategories();
  const [selectedCatId, setSelectedCatId] = useState('elementary');

  const ranking = getRankingByCategory(selectedCatId);
  const currentCategory = categories.find(c => c.id === selectedCatId);

  // Top 3 equipos para el podio
  const top1 = ranking[0] || null;
  const top2 = ranking[1] || null;
  const top3 = ranking[2] || null;

  const getRankBadge = (index) => {
    switch (index) {
      case 0:
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-amber-950 font-black text-xs shadow-md border border-amber-300">
            🥇 1
          </div>
        );
      case 1:
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 text-slate-800 font-black text-xs shadow-sm border border-slate-300">
            🥈 2
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-orange-200 to-amber-300 text-orange-950 font-black text-xs shadow-sm border border-orange-300">
            🥉 3
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs">
            #{index + 1}
          </div>
        );
    }
  };

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-7 shadow-sm space-y-6 animate-fadeIn">
      {/* Header del Módulo con Pestañas de Categoría */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 border border-amber-200 shadow-sm">
              <Trophy className="w-6 h-6 animate-pulseGlow text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Clasificación Oficial WRO
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 font-extrabold uppercase tracking-wider">
                  Live Ranking
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Tabla comparativa de rendimiento clasificada según normas oficiales WRO (Mayor puntaje; menor tiempo de desempate).
              </p>
            </div>
          </div>
        </div>

        {/* Pestañas de Categoría */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 border border-slate-200 self-start md:self-auto shadow-inner">
          {categories.map((cat) => {
            const isActive = selectedCatId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                <span>{cat.nombre}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                    isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat.edad}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Podio Visual de los Mejores Equipos (Top 3) */}
      {ranking.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          {/* 2do Lugar (Izquierda en podio) */}
          {top2 && (
            <div className="order-2 md:order-1 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 via-white to-slate-50 p-4 relative overflow-hidden flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 text-[11px] font-black border border-slate-300">
                  🥈 2° Lugar
                </span>
                <span className="text-[10px] text-slate-500 font-mono font-bold">WRO Cat</span>
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900">{top2.team.nombre}</h4>
                <div className="text-xs text-slate-600 flex items-center gap-1 mt-0.5 font-medium">
                  <Bot className="w-3.5 h-3.5 text-slate-400" />
                  {top2.team.robotDefault}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Mejor Puntaje</span>
                  <span className="text-xl font-black text-slate-900">
                    {top2.bestGeneral ? `${top2.bestGeneral.puntaje} pts` : '--'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Tiempo</span>
                  <span className="font-mono text-xs font-bold text-slate-800">
                    {top2.bestGeneral?.tiempo || '--:--'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 1er Lugar (Centro, más alto y dorado) */}
          {top1 && (
            <div className="order-1 md:order-2 rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-amber-50/80 via-white to-amber-50/40 p-5 relative overflow-hidden flex flex-col justify-between shadow-lg shadow-amber-200/40 transform md:-translate-y-2 hover:border-amber-500 transition-all">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black border border-amber-300 shadow-sm">
                  <Crown className="w-3.5 h-3.5 text-amber-600" />
                  🥇 1° Líder de Categoría
                </span>
                <span className="text-[10px] text-amber-800 font-extrabold uppercase tracking-wider">Top Score</span>
              </div>

              <div>
                <h4 className="text-xl font-black text-slate-900">{top1.team.nombre}</h4>
                <div className="text-xs text-amber-900 flex items-center gap-1 mt-0.5 font-bold">
                  <Bot className="w-3.5 h-3.5 text-amber-700" />
                  Robot: {top1.team.robotDefault}
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Puntaje Máximo</span>
                  <span className="text-2xl font-black text-amber-700">
                    {top1.bestGeneral ? `${top1.bestGeneral.puntaje} pts` : '--'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Tiempo Récord</span>
                  <span className="font-mono text-sm font-bold text-slate-900 flex items-center justify-end gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    {top1.bestGeneral?.tiempo || '--:--'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3er Lugar (Derecha en podio) */}
          {top3 && (
            <div className="order-3 md:order-3 rounded-2xl border border-slate-200 bg-gradient-to-b from-orange-50/40 via-white to-slate-50 p-4 relative overflow-hidden flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100 text-orange-900 text-[11px] font-black border border-orange-200">
                  🥉 3° Lugar
                </span>
                <span className="text-[10px] text-slate-500 font-mono font-bold">WRO Cat</span>
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900">{top3.team.nombre}</h4>
                <div className="text-xs text-slate-600 flex items-center gap-1 mt-0.5 font-medium">
                  <Bot className="w-3.5 h-3.5 text-slate-400" />
                  {top3.team.robotDefault}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Mejor Puntaje</span>
                  <span className="text-xl font-black text-slate-900">
                    {top3.bestGeneral ? `${top3.bestGeneral.puntaje} pts` : '--'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Tiempo</span>
                  <span className="font-mono text-xs font-bold text-slate-800">
                    {top3.bestGeneral?.tiempo || '--:--'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabla Completa de Clasificación */}
      <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 text-xs uppercase tracking-wider font-extrabold">
                <th className="p-3.5 text-center w-16">Puesto</th>
                <th className="p-3.5">Equipo</th>
                <th className="p-3.5 text-center">Mejor Puntaje</th>
                <th className="p-3.5 text-center">Tiempo (Desempate)</th>
                <th className="p-3.5 text-center">Récord en Regional</th>
                <th className="p-3.5 text-center">Récord en Práctica</th>
                <th className="p-3.5 text-center">Rondas Totales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {ranking.map((item, index) => {
                const isMyTeam = userTeamId === item.team.id;
                const hasRecords = item.bestGeneral !== null;
                const score = item.bestGeneral?.puntaje || 0;
                const pct = Math.min(100, (score / 120) * 100);

                return (
                  <tr
                    key={item.team.id}
                    className={`transition-all duration-200 ${
                      isMyTeam
                        ? 'bg-blue-50/80 border-l-4 border-l-blue-600 font-semibold'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Puesto */}
                    <td className="p-3.5 text-center">
                      <div className="flex justify-center">{getRankBadge(index)}</div>
                    </td>

                    {/* Equipo */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-xl bg-gradient-to-tr ${item.team.color} p-[1.5px] shadow-sm`}>
                          <div className="h-full w-full bg-white rounded-[10px] flex items-center justify-center font-black text-xs text-slate-900 border border-slate-200">
                            {item.team.nombre.substring(0, 2).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 flex items-center gap-2">
                            <span>{item.team.nombre}</span>
                            {isMyTeam && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 font-bold">
                                Tu Equipo
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                            <Bot className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.team.robotDefault}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Mejor Puntaje con barra de efectividad */}
                    <td className="p-3.5 text-center">
                      {hasRecords ? (
                        <div className="flex flex-col items-center">
                          <span className="text-base font-black text-slate-900">
                            {item.bestGeneral.puntaje}{' '}
                            <span className="text-[10px] text-slate-500 font-bold">pts</span>
                          </span>
                          <div className="w-16 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono font-bold">--</span>
                      )}
                    </td>

                    {/* Mejor Tiempo */}
                    <td className="p-3.5 text-center font-mono">
                      {hasRecords ? (
                        <span className="font-bold text-slate-900 flex items-center justify-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          {item.bestGeneral.tiempo}
                        </span>
                      ) : (
                        <span className="text-slate-400">--:--</span>
                      )}
                    </td>

                    {/* Récord en Regional */}
                    <td className="p-3.5 text-center">
                      {item.bestRegional ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-900 text-[11px] font-bold border border-amber-200">
                          <Award className="w-3.5 h-3.5 text-amber-600" />
                          <span>{item.bestRegional.puntaje} pts</span>
                          <span className="text-amber-700 font-mono">({item.bestRegional.tiempo})</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Sin registro</span>
                      )}
                    </td>

                    {/* Récord en Práctica */}
                    <td className="p-3.5 text-center">
                      {item.bestPractica ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-900 text-[11px] font-bold border border-blue-200">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <span>{item.bestPractica.puntaje} pts</span>
                          <span className="text-blue-700 font-mono">({item.bestPractica.tiempo})</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Sin registro</span>
                      )}
                    </td>

                    {/* Rondas Totales */}
                    <td className="p-3.5 text-center">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
                        {item.totalRondas} rondas
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer del Leaderboard */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 font-medium gap-2 pt-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Criterio oficial WRO: 1° Mayor puntaje acumulado • Desempate: Menor tiempo en pista.</span>
        </div>
        <div className="text-slate-600">
          Mostrando <strong className="text-slate-900">{ranking.length}</strong> equipos en {currentCategory?.nombre}.
        </div>
      </div>
    </div>
  );
};

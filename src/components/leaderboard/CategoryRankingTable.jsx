import React, { useState } from 'react';
import { getRankingByCategory, getCategories } from '../../services/storageService';
import { Trophy, Medal, Clock, Sparkles, Award, Users, ChevronRight } from 'lucide-react';

export const CategoryRankingTable = ({ userTeamId = null }) => {
  const categories = getCategories();
  const [selectedCatId, setSelectedCatId] = useState('elementary');

  const ranking = getRankingByCategory(selectedCatId);
  const currentCategory = categories.find(c => c.id === selectedCatId);

  const getRankBadge = (index) => {
    switch (index) {
      case 0:
        return (
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black text-xs shadow-md shadow-amber-500/20">
            🥇 1
          </div>
        );
      case 1:
        return (
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-300/20 text-slate-200 border border-slate-300/40 font-black text-xs">
            🥈 2
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/20 text-amber-500 border border-amber-700/40 font-black text-xs">
            🥉 3
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-slate-400 font-bold text-xs">
            #{index + 1}
          </div>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl">
      {/* Header del Módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Clasificación General por Categoría</h2>
              <p className="text-xs text-slate-400">
                Módulo exclusivo para representantes: Comparativa de rendimiento WRO (Puntaje mayor y desempate por tiempo).
              </p>
            </div>
          </div>
        </div>

        {/* Pestañas de Categoría */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
          {categories.map((cat) => {
            const isActive = selectedCatId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{cat.nombre}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-blue-800 text-blue-200' : 'bg-slate-800 text-slate-400'}`}>
                  {cat.edad}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabla de Clasificación */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
              <th className="p-3.5 text-center w-16">Puesto</th>
              <th className="p-3.5">Equipo</th>
              <th className="p-3.5 text-center">Mejor Puntaje</th>
              <th className="p-3.5 text-center">Mejor Tiempo</th>
              <th className="p-3.5 text-center">Récord en Regional</th>
              <th className="p-3.5 text-center">Récord en Práctica</th>
              <th className="p-3.5 text-center">Rondas Totales</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-xs">
            {ranking.map((item, index) => {
              const isMyTeam = userTeamId === item.team.id;
              const hasRecords = item.bestGeneral !== null;

              return (
                <tr
                  key={item.team.id}
                  className={`transition ${
                    isMyTeam
                      ? 'bg-blue-500/10 border-l-4 border-l-blue-500'
                      : 'hover:bg-slate-900/40'
                  }`}
                >
                  {/* Puesto */}
                  <td className="p-3.5 text-center">
                    <div className="flex justify-center">{getRankBadge(index)}</div>
                  </td>

                  {/* Equipo */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-lg bg-gradient-to-tr ${item.team.color} p-[1px]`}>
                        <div className="h-full w-full bg-slate-950 rounded-[7px] flex items-center justify-center font-black text-xs text-white">
                          {item.team.nombre.substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          {item.team.nombre}
                          {isMyTeam && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                              Tu Equipo
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Robot: <span className="text-slate-300">{item.team.robotDefault}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Mejor Puntaje */}
                  <td className="p-3.5 text-center">
                    {hasRecords ? (
                      <span className="text-base font-black text-amber-400">
                        {item.bestGeneral.puntaje} <span className="text-[10px] text-slate-500">pts</span>
                      </span>
                    ) : (
                      <span className="text-slate-600 font-mono">--</span>
                    )}
                  </td>

                  {/* Mejor Tiempo (Desempate WRO) */}
                  <td className="p-3.5 text-center font-mono">
                    {hasRecords ? (
                      <span className="font-bold text-slate-200 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {item.bestGeneral.tiempo}
                      </span>
                    ) : (
                      <span className="text-slate-600">--:--</span>
                    )}
                  </td>

                  {/* Mejor en Regional */}
                  <td className="p-3.5 text-center">
                    {item.bestRegional ? (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 text-[11px] font-semibold border border-amber-500/20">
                        <Award className="w-3 h-3" />
                        {item.bestRegional.puntaje} pts ({item.bestRegional.tiempo})
                      </div>
                    ) : (
                      <span className="text-slate-600 text-[11px]">Sin registro</span>
                    )}
                  </td>

                  {/* Mejor en Práctica */}
                  <td className="p-3.5 text-center">
                    {item.bestPractica ? (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 text-[11px] font-semibold border border-cyan-500/20">
                        <Sparkles className="w-3 h-3" />
                        {item.bestPractica.puntaje} pts ({item.bestPractica.tiempo})
                      </div>
                    ) : (
                      <span className="text-slate-600 text-[11px]">Sin registro</span>
                    )}
                  </td>

                  {/* Rondas Totales */}
                  <td className="p-3.5 text-center">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300">
                      {item.totalRondas} rondas
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          <span>Criterio oficial WRO: Ordenado por mayor puntaje absoluto; desempate por menor tiempo.</span>
        </div>
        <div>
          Mostrando <strong className="text-white">{ranking.length}</strong> equipos en categoría {currentCategory?.nombre}.
        </div>
      </div>
    </div>
  );
};

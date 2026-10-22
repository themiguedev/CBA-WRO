import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getSessionsByTeam, calculateBestResult, getCategories } from '../../services/storageService';
import { BitacoraTable } from '../bitacora/BitacoraTable';
import { BestScoreBadge } from '../bitacora/BestScoreBadge';
import { CategoryRankingTable } from '../leaderboard/CategoryRankingTable';
import { Users, Trophy, BookOpen, Bot, Calendar, Sparkles, ShieldAlert } from 'lucide-react';

export const ParentDashboard = () => {
  const { currentUser, userTeam } = useAuth();
  const categories = getCategories();

  const [activeTab, setActiveTab] = useState('ranking'); // 'ranking' | 'bitacora'

  if (!userTeam) {
    return (
      <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/60 text-center">
        <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">No tienes un equipo asignado</h3>
        <p className="text-sm text-slate-400 mt-1">
          Por favor contacta al profesor para que vincule tu cuenta al equipo de tu representado.
        </p>
      </div>
    );
  }

  const category = categories.find(c => c.id === userTeam.categoriaId);
  const sessions = getSessionsByTeam(userTeam.id);
  const bestResult = calculateBestResult(sessions);

  const [activeSessionId, setActiveSessionId] = useState(sessions[0]?.id || null);
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0] || null;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Cabecera del Representante */}
      <div className="rounded-3xl border border-slate-800/80 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className={`h-16 w-16 rounded-2xl bg-gradient-to-tr ${userTeam.color} p-[2px] shadow-lg`}>
              <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Users className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold uppercase tracking-wider">
                  Panel de Representante
                </span>
                <span className="text-xs text-slate-500">• Equipo Representado</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {userTeam.nombre} <span className="text-slate-400 font-normal text-lg">({category?.nombre})</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Seguimiento de entrenamientos y comparativa de rendimiento para las Regionales WRO Venezuela.
              </p>
            </div>
          </div>

          {/* Selector de Pestañas Principales */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('ranking')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'ranking'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Clasificación por Categoría</span>
            </button>
            <button
              onClick={() => setActiveTab('bitacora')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'bitacora'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Bitácora de Mi Equipo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Módulo: Mejor Resultado de su Equipo (Siempre visible para referencia inmediata) */}
      <BestScoreBadge
        best={bestResult}
        teamName={userTeam.nombre}
        categoryName={category?.nombre}
      />

      {/* Contenido Condicional según Pestaña */}
      {activeTab === 'ranking' ? (
        /* Módulo Exclusivo para Representantes: Clasificación por Categorías */
        <CategoryRankingTable userTeamId={userTeam.id} />
      ) : (
        /* Módulo de Seguimiento de su Equipo */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <BookOpen className="w-4 h-4 text-blue-400" />
              Historial de Rondas y Bitácoras Técnicas
            </div>

            {/* Selector de Semanas */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {sessions.map((s) => {
                const isSelected = activeSession?.id === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSessionId(s.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Calendar className="w-3 h-3" />
                    <span>Semana {s.semanaNumero}</span>
                    <span className={`text-[9px] uppercase px-1 rounded ${
                      s.tipoEvento === 'regional' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {s.tipoEvento}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {activeSession ? (
            <BitacoraTable
              session={activeSession}
              isEditable={false}
              teamName={userTeam.nombre}
            />
          ) : (
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/40 text-center text-slate-400">
              No hay bitácoras registradas para este equipo.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

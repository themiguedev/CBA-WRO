import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getSessionsByTeam, calculateBestResult, getCategories } from '../../services/storageService';
import { BitacoraTable } from '../bitacora/BitacoraTable';
import { BestScoreBadge } from '../bitacora/BestScoreBadge';
import { CategoryRankingTable } from '../leaderboard/CategoryRankingTable';
import { Users, Trophy, BookOpen, Calendar, ShieldAlert } from 'lucide-react';

export const ParentDashboard = () => {
  const { userTeam } = useAuth();
  const categories = getCategories();

  const [activeTab, setActiveTab] = useState('ranking'); // 'ranking' | 'bitacora'

  if (!userTeam) {
    return (
      <div className="p-8 rounded-3xl border border-slate-200 bg-white text-center shadow-sm">
        <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900">No tienes un equipo asignado</h3>
        <p className="text-sm text-slate-600 mt-1">
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
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className={`h-16 w-16 rounded-2xl bg-gradient-to-tr ${userTeam.color} p-[2px] shadow-md`}>
              <div className="h-full w-full bg-white rounded-[14px] flex items-center justify-center border border-slate-200">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold uppercase tracking-wider">
                  Panel de Representante
                </span>
                <span className="text-xs text-slate-500 font-medium">• Equipo Representado</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {userTeam.nombre} <span className="text-slate-500 font-normal text-lg">({category?.nombre})</span>
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Seguimiento de entrenamientos y comparativa de rendimiento para las Regionales WRO Venezuela.
              </p>
            </div>
          </div>

          {/* Selector de Pestañas Principales */}
          <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('ranking')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'ranking'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Clasificación por Categoría</span>
            </button>
            <button
              onClick={() => setActiveTab('bitacora')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'bitacora'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
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
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
              <BookOpen className="w-4 h-4 text-blue-600" />
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
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Semana {s.semanaNumero}</span>
                    <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-black ${
                      s.tipoEvento === 'regional' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
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
            <div className="p-10 rounded-3xl border border-slate-200 bg-white text-center text-slate-500 font-medium shadow-sm">
              No hay bitácoras registradas para este equipo.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

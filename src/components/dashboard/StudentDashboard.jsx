import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getSessionsByTeam, calculateBestResult, getCategories } from '../../services/storageService';
import { BitacoraTable } from '../bitacora/BitacoraTable';
import { BestScoreBadge } from '../bitacora/BestScoreBadge';
import { Bot, Calendar, Sparkles, BookOpen, Clock, Award, ShieldAlert } from 'lucide-react';

export const StudentDashboard = () => {
  const { currentUser, userTeam } = useAuth();
  const categories = getCategories();

  if (!userTeam) {
    return (
      <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/60 text-center">
        <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">No tienes un equipo asignado</h3>
        <p className="text-sm text-slate-400 mt-1">
          Por favor contacta al profesor para que vincule tu cuenta a tu equipo de robótica.
        </p>
      </div>
    );
  }

  const category = categories.find(c => c.id === userTeam.categoriaId);
  const sessions = getSessionsByTeam(userTeam.id);
  const bestResult = calculateBestResult(sessions);

  const [activeSessionId, setActiveSessionId] = useState(sessions[0]?.id || null);
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0] || null;

  // Estadísticas rápidas para el alumno
  const totalRondas = sessions.reduce((acc, s) => acc + (s.rondas?.length || 0), 0);

  return (
    <div className="space-y-8">
      {/* Cabecera del Alumno y su Equipo */}
      <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`h-16 w-16 rounded-2xl bg-gradient-to-tr ${userTeam.color} p-[2px] shadow-lg`}>
              <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Bot className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-bold uppercase tracking-wider">
                  Categoría {category?.nombre}
                </span>
                <span className="text-xs text-slate-500">({category?.edad})</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Equipo: {userTeam.nombre}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Robot Oficial: <strong className="text-slate-200">{userTeam.robotDefault}</strong> • Modo Consulta de Alumno
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Semanas de Práctica</div>
              <div className="text-lg font-black text-white">{sessions.length}</div>
            </div>
            <div className="bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Rondas en Pista</div>
              <div className="text-lg font-black text-cyan-400">{totalRondas}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Módulo 1: Mejor Resultado del Equipo */}
      <div>
        <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Award className="w-4 h-4 text-amber-400" />
          Récord Histórico de tu Equipo
        </div>
        <BestScoreBadge
          best={bestResult}
          teamName={userTeam.nombre}
          categoryName={category?.nombre}
        />
      </div>

      {/* Módulo 2: Seguimiento Semanal de la Bitácora */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <BookOpen className="w-4 h-4 text-blue-400" />
            Seguimiento Semanal de Funcionalidad Técnica
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
            El profesor aún no ha cargado bitácoras para tu equipo.
          </div>
        )}
      </div>
    </div>
  );
};

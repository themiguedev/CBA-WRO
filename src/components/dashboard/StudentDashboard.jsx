import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getSessionsByTeam, calculateBestResult, getCategories } from '../../services/storageService';
import { BitacoraTable } from '../bitacora/BitacoraTable';
import { BestScoreBadge } from '../bitacora/BestScoreBadge';
import { Bot, Calendar, BookOpen, Award, ShieldAlert } from 'lucide-react';

export const StudentDashboard = () => {
  const { userTeam } = useAuth();
  const categories = getCategories();

  if (!userTeam) {
    return (
      <div className="p-8 rounded-3xl border border-slate-200 bg-white text-center shadow-sm">
        <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900">No tienes un equipo asignado</h3>
        <p className="text-sm text-slate-600 mt-1">
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
    <div className="space-y-8 animate-fadeIn">
      {/* Cabecera del Alumno y su Equipo */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className={`h-16 w-16 rounded-2xl bg-gradient-to-tr ${userTeam.color} p-[2px] shadow-md`}>
              <div className="h-full w-full bg-white rounded-[14px] flex items-center justify-center border border-slate-200">
                <Bot className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 font-extrabold uppercase tracking-wider">
                  Categoría {category?.nombre}
                </span>
                <span className="text-xs text-slate-500 font-medium">({category?.edad})</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Equipo: {userTeam.nombre}
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Robot Oficial: <strong className="text-slate-800">{userTeam.robotDefault}</strong> • Modo Consulta de Alumno
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 text-center shadow-sm">
              <div className="text-[10px] uppercase font-bold text-slate-500">Semanas de Práctica</div>
              <div className="text-lg font-black text-slate-900">{sessions.length}</div>
            </div>
            <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 text-center shadow-sm">
              <div className="text-[10px] uppercase font-bold text-slate-500">Rondas en Pista</div>
              <div className="text-lg font-black text-blue-600">{totalRondas}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Módulo 1: Mejor Resultado del Equipo */}
      <div>
        <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-600">
          <Award className="w-4 h-4 text-amber-600" />
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
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
            <BookOpen className="w-4 h-4 text-blue-600" />
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
            El profesor aún no ha cargado bitácoras para tu equipo.
          </div>
        )}
      </div>
    </div>
  );
};

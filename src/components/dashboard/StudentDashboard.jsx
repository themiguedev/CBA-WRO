import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getSessionsByTeam, calculateBestResult, getCategories, updateTeam } from '../../services/storageService';
import { BitacoraTable } from '../bitacora/BitacoraTable';
import { BestScoreBadge } from '../bitacora/BestScoreBadge';
import { Bot, Calendar, BookOpen, Award, ShieldAlert, Pencil, Check, X } from 'lucide-react';

export const StudentDashboard = () => {
  const { userTeam } = useAuth();
  const categories = getCategories();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [activeSessionId, setActiveSessionId] = useState(null);

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
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0] || null;

  // Estadísticas rápidas para el alumno
  const totalRondas = sessions.reduce((acc, s) => acc + (s.rondas?.length || 0), 0);

  const handleStartEdit = () => {
    setNameInput(userTeam.nombre);
    setIsEditingName(true);
    setFeedback('');
  };

  const handleSaveName = (e) => {
    e?.preventDefault();
    if (!nameInput.trim()) return;
    updateTeam(userTeam.id, { nombre: nameInput.trim() });
    setIsEditingName(false);
    setFeedback('Nombre actualizado correctamente');
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Cabecera del Alumno y su Equipo con color vibrante de robot */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/30 p-6 sm:p-7 shadow-sm relative overflow-hidden">
        {/* Franja superior con el color oficial del equipo */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${userTeam.color || 'from-blue-600 to-cyan-500'}`} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 pt-1">
          <div className="flex items-center gap-4">
            <div className={`h-16 w-16 rounded-2xl bg-gradient-to-tr ${userTeam.color || 'from-blue-600 to-cyan-500'} p-[2px] shadow-md shadow-blue-500/20`}>
              <div className="h-full w-full bg-white rounded-[14px] flex items-center justify-center border border-slate-200">
                <Bot className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-900 border border-blue-200 font-extrabold uppercase tracking-wider shadow-sm">
                  Categoría {category?.nombre}
                </span>
                <span className="text-xs text-slate-500 font-medium">({category?.edad})</span>
              </div>
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-2 mt-1">
                  <span className="text-xl font-bold text-slate-700">Equipo:</span>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-3 py-1.5 text-base sm:text-xl font-black text-slate-900 bg-blue-50/50 border border-blue-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                    autoFocus
                  />
                  <button
                    type="submit"
                    title="Guardar nombre"
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition cursor-pointer shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    title="Cancelar"
                    className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                    Equipo: <span className="text-blue-700">{userTeam.nombre}</span>
                  </h1>
                  <button
                    onClick={handleStartEdit}
                    title="Editar nombre del equipo"
                    className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              )}

              {feedback && (
                <div className="text-xs font-bold text-emerald-600 mt-0.5 animate-fadeIn">
                  ✓ {feedback}
                </div>
              )}
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Robot Oficial: <strong className="text-slate-800">{userTeam.robotDefault}</strong> • Modo Consulta de Alumno
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-50/90 to-blue-50/50 px-4 py-2.5 rounded-2xl border border-indigo-200/80 text-center shadow-sm">
              <div className="text-[10px] uppercase font-extrabold text-indigo-700 flex items-center justify-center gap-1">
                <Calendar className="w-3 h-3" /> Semanas
              </div>
              <div className="text-xl font-black text-slate-900 mt-0.5">{sessions.length}</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50/90 to-teal-50/50 px-4 py-2.5 rounded-2xl border border-emerald-200/80 text-center shadow-sm">
              <div className="text-[10px] uppercase font-extrabold text-emerald-700 flex items-center justify-center gap-1">
                <Bot className="w-3 h-3" /> Rondas
              </div>
              <div className="text-xl font-black text-emerald-700 mt-0.5">{totalRondas}</div>
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
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                      : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  <span>Semana {s.semanaNumero}</span>
                  <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded-full font-black border ${
                    s.tipoEvento === 'regional' ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {s.tipoEvento === 'regional' ? '🏆 Regional' : '🛠️ Práctica'}
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

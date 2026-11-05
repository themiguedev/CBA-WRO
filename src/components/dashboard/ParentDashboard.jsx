import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getSessionsByTeam, calculateBestResult, getCategories, updateTeam } from '../../services/storageService';
import { BitacoraTable } from '../bitacora/BitacoraTable';
import { BestScoreBadge } from '../bitacora/BestScoreBadge';
import { CategoryRankingTable } from '../leaderboard/CategoryRankingTable';
import { Users, Trophy, BookOpen, Calendar, ShieldAlert, Pencil, Check, X } from 'lucide-react';

export const ParentDashboard = () => {
  const { userTeam } = useAuth();
  const categories = getCategories();

  const [activeTab, setActiveTab] = useState('ranking'); // 'ranking' | 'bitacora'
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
          Por favor contacta al profesor para que vincule tu cuenta al equipo de tu representado.
        </p>
      </div>
    );
  }

  const category = categories.find(c => c.id === userTeam.categoriaId);
  const sessions = getSessionsByTeam(userTeam.id);
  const bestResult = calculateBestResult(sessions);
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0] || null;

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
      {/* Cabecera del Representante con colores de identidad */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/20 p-6 sm:p-7 shadow-sm relative overflow-hidden">
        {/* Franja superior de identidad del equipo */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${userTeam.color || 'from-emerald-500 to-teal-600'}`} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 pt-1">
          <div className="flex items-center gap-4">
            <div className={`h-16 w-16 rounded-2xl bg-gradient-to-tr ${userTeam.color || 'from-emerald-500 to-teal-600'} p-[2px] shadow-md shadow-emerald-500/20`}>
              <div className="h-full w-full bg-white rounded-[14px] flex items-center justify-center border border-slate-200">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-900 border border-emerald-300 font-extrabold uppercase tracking-wider shadow-sm">
                  Panel de Representante
                </span>
                <span className="text-xs text-slate-500 font-medium">• Equipo Representado</span>
              </div>
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-3 py-1.5 text-base sm:text-xl font-black text-slate-900 bg-emerald-50/50 border border-emerald-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    autoFocus
                  />
                  <span className="text-slate-500 font-normal text-sm">({category?.nombre})</span>
                  <button
                    type="submit"
                    title="Guardar nombre"
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition cursor-pointer shadow-sm"
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
                    <span className="text-emerald-800">{userTeam.nombre}</span> <span className="text-slate-500 font-normal text-lg">({category?.nombre})</span>
                  </h1>
                  <button
                    onClick={handleStartEdit}
                    title="Editar nombre del equipo"
                    className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
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
                Seguimiento de entrenamientos y comparativa de rendimiento para las Regionales WRO Venezuela.
              </p>
            </div>
          </div>

          {/* Selector de Pestañas Principales con color vibrante */}
          <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 border border-slate-200 self-start md:self-auto shadow-inner">
            <button
              onClick={() => setActiveTab('ranking')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'ranking'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25 scale-[1.02]'
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
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
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

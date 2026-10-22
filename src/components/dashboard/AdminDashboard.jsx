import React, { useState } from 'react';
import { getTeams, getSessionsByTeam, saveSession, deleteSession, calculateBestResult, getCategories } from '../../services/storageService';
import { BitacoraTable } from '../bitacora/BitacoraTable';
import { BestScoreBadge } from '../bitacora/BestScoreBadge';
import { PlusCircle, Calendar, Trash2, Edit3, Bot, ChevronRight, Layers, ShieldCheck } from 'lucide-react';

export const AdminDashboard = () => {
  const teams = getTeams();
  const categories = getCategories();

  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || 'robotex');
  const [sessionsVersion, setSessionsVersion] = useState(0); // Para forzar re-render tras guardar
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const selectedTeam = teams.find(t => t.id === selectedTeamId);
  const selectedCategory = categories.find(c => c.id === selectedTeam?.categoriaId);
  const teamSessions = getSessionsByTeam(selectedTeamId);
  const bestResult = calculateBestResult(teamSessions);

  // Sesión actualmente seleccionada para ver/editar
  const activeSession = isCreatingNew
    ? {
        id: `sesion_${Date.now()}`,
        equipoId: selectedTeamId,
        fecha: new Date().toISOString().split('T')[0],
        semanaNumero: teamSessions.length + 1,
        nombreRobot: selectedTeam?.robotDefault || 'Prototipo',
        tipoEvento: 'practica',
        rondas: Array.from({ length: 10 }, (_, i) => ({
          numero: i + 1,
          tiempo: '',
          puntaje: '',
          observaciones: ''
        }))
      }
    : (teamSessions.find(s => s.id === activeSessionId) || teamSessions[0] || null);

  const handleSaveSession = (sessionData) => {
    saveSession(sessionData);
    setSessionsVersion(v => v + 1);
    setIsCreatingNew(false);
    setActiveSessionId(sessionData.id);
  };

  const handleDeleteSession = (sessionId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro de bitácora?')) {
      deleteSession(sessionId);
      setSessionsVersion(v => v + 1);
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
      }
    }
  };

  const startNewSession = () => {
    setIsCreatingNew(true);
    setActiveSessionId(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner Superior Profesor */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-1.5">
            <span className="p-1 rounded-md bg-purple-500/10 border border-purple-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
            Panel de Control del Profesor / Administrador
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Gestión y Seguimiento Semanal de Equipos
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Carga y modifica los tiempos, puntajes y bitácoras técnicas de funcionalidad para cada equipo.
          </p>
        </div>

        <button
          onClick={startNewSession}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Nueva Sesión de Bitácora
        </button>
      </div>

      {/* Selector de Equipos por Tarjetas */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-500" />
          Selecciona un equipo para gestionar:
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {teams.map((t) => {
            const isSelected = selectedTeamId === t.id;
            const cat = categories.find(c => c.id === t.categoriaId);
            return (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTeamId(t.id);
                  setActiveSessionId(null);
                  setIsCreatingNew(false);
                }}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/25 scale-[1.03] ring-1 ring-blue-500/50'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700 hover:-translate-y-1'
                }`}
              >
                <div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    t.categoriaId === 'junior' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
                  }`}>
                    {cat?.nombre}
                  </span>
                  <div className="font-black text-sm text-white mt-2.5 truncate">{t.nombre}</div>
                </div>
                <div className="text-[11px] text-slate-400 mt-2.5 truncate flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t.robotDefault}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mejor Resultado del Equipo */}
      <BestScoreBadge
        best={bestResult}
        teamName={selectedTeam?.nombre}
        categoryName={selectedCategory?.nombre}
      />

      {/* Historial de Semanas y Formulario de Bitácora */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lista Lateral de Sesiones Semanales */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Semanas Registradas ({teamSessions.length})
            </h3>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {isCreatingNew && (
              <div className="p-3 rounded-xl border border-blue-500 bg-blue-500/10 text-white text-xs font-bold flex items-center justify-between">
                <span>Nueva Sesión (En curso)</span>
                <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded text-white font-mono">Borrador</span>
              </div>
            )}

            {teamSessions.length === 0 && !isCreatingNew ? (
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 text-center text-xs text-slate-500">
                Sin registros aún para {selectedTeam?.nombre}. Haz clic en "Nueva Sesión de Bitácora".
              </div>
            ) : (
              teamSessions.map((session) => {
                const isCurrentActive = activeSession?.id === session.id && !isCreatingNew;
                const isRegional = session.tipoEvento === 'regional';

                return (
                  <div
                    key={session.id}
                    onClick={() => {
                      setActiveSessionId(session.id);
                      setIsCreatingNew(false);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between group ${
                      isCurrentActive
                        ? 'bg-slate-800 border-slate-600 shadow-md'
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">Semana {session.semanaNumero}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            isRegional
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-cyan-500/20 text-cyan-300'
                          }`}
                        >
                          {session.tipoEvento}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {session.fecha}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(session.id);
                        }}
                        title="Eliminar sesión"
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Tabla Fiel de Bitácora (Editable para Admin) */}
        <div className="lg:col-span-3">
          {activeSession ? (
            <BitacoraTable
              key={`${activeSession.id}_${sessionsVersion}`}
              session={activeSession}
              isEditable={true}
              onSave={handleSaveSession}
              teamName={selectedTeam?.nombre}
            />
          ) : (
            <div className="p-12 rounded-2xl border border-slate-800 bg-slate-900/40 text-center">
              <Bot className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">Sin bitácoras para {selectedTeam?.nombre}</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Aún no has registrado sesiones de entrenamiento o competencias para este equipo.
              </p>
              <button
                onClick={startNewSession}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Registrar Primera Semana (10 Rondas)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

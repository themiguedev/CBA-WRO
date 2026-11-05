import React, { useState, useEffect } from 'react';
import { getTeams, getSessionsByTeam, saveSession, deleteSession, calculateBestResult, getCategories } from '../../services/storageService';
import { BitacoraTable } from '../bitacora/BitacoraTable';
import { BestScoreBadge } from '../bitacora/BestScoreBadge';
import { TeamManagerModal } from './TeamManagerModal';
import { PlusCircle, Calendar, Trash2, Bot, ChevronRight, Layers, ShieldCheck, Pencil, Plus } from 'lucide-react';

export const AdminDashboard = () => {
  const [teamsVersion, setTeamsVersion] = useState(0);
  const teams = getTeams();
  const categories = getCategories();

  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || 'robotex');
  const [sessionsVersion, setSessionsVersion] = useState(0); // Para forzar re-render tras guardar
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Estado del modal de gestión y edición de equipos
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamModalTab, setTeamModalTab] = useState('list');
  const [teamModalFocusId, setTeamModalFocusId] = useState(null);

  useEffect(() => {
    const handleTeamsUpdate = () => {
      setTeamsVersion(v => v + 1);
    };
    window.addEventListener('cba_teams_updated', handleTeamsUpdate);
    return () => window.removeEventListener('cba_teams_updated', handleTeamsUpdate);
  }, []);

  // Asegurar que si el equipo seleccionado ya no existe, seleccione el primero
  useEffect(() => {
    const currentTeams = getTeams();
    if (!currentTeams.some(t => t.id === selectedTeamId) && currentTeams[0]) {
      setSelectedTeamId(currentTeams[0].id);
    }
  }, [teamsVersion, selectedTeamId]);

  const selectedTeam = teams.find(t => t.id === selectedTeamId) || teams[0];
  const selectedCategory = categories.find(c => c.id === selectedTeam?.categoriaId);
  const teamSessions = getSessionsByTeam(selectedTeamId);
  const bestResult = calculateBestResult(teamSessions);

  const openTeamModal = (tab = 'list', focusId = null) => {
    setTeamModalTab(tab);
    setTeamModalFocusId(focusId);
    setIsTeamModalOpen(true);
  };

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
      {/* Banner Superior Profesor con toques tecnológicos de color */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-200/80 bg-gradient-to-r from-white via-indigo-50/40 to-blue-50/50 p-6 sm:p-7 shadow-sm">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">
              <span className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm shadow-indigo-500/30">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span>Panel de Control del Docente / Administrador</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Gestión y Seguimiento Semanal de Equipos
            </h1>
            <p className="text-sm text-slate-600 mt-1 font-medium">
              Carga y modifica los tiempos, puntajes y bitácoras técnicas de funcionalidad para cada equipo.
            </p>
          </div>

          <button
            onClick={startNewSession}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Nueva Sesión de Bitácora
          </button>
        </div>
      </div>

      {/* Selector de Equipos por Tarjetas con Identidad de Color de Cada Robot */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Selecciona un equipo para gestionar ({teams.length} equipos):</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => openTeamModal('list', selectedTeamId)}
              className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/80 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              title="Editar nombre de los equipos registrados"
            >
              <Pencil className="w-3.5 h-3.5 text-blue-600" />
              <span>Editar Equipos</span>
            </button>

            <button
              onClick={() => openTeamModal('create')}
              className="px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              title="Registrar un nuevo equipo"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Registrar Nuevo</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {teams.map((t) => {
            const isSelected = selectedTeamId === t.id;
            const cat = categories.find(c => c.id === t.categoriaId);
            return (
              <div
                key={t.id}
                onClick={() => {
                  setSelectedTeamId(t.id);
                  setActiveSessionId(null);
                  setIsCreatingNew(false);
                }}
                className={`pt-5 pb-4 px-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer relative group overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-b from-blue-50/90 to-indigo-50/50 border-blue-600 shadow-md ring-2 ring-blue-500/25 scale-[1.02]'
                    : 'bg-white border-slate-200 hover:bg-slate-50/80 hover:border-slate-300 hover:-translate-y-0.5 shadow-sm'
                }`}
              >
                {/* Franja superior con el color oficial del equipo */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${t.color || 'from-blue-600 to-cyan-500'}`} />

                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      t.categoriaId === 'junior' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {cat?.nombre}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openTeamModal('list', t.id);
                      }}
                      title={`Editar nombre de ${t.nombre}`}
                      className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-100/60 transition cursor-pointer"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${t.color || 'from-blue-600 to-cyan-500'} text-white flex items-center justify-center font-black text-[11px] shadow-sm shrink-0`}>
                      {t.nombre.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="font-black text-sm text-slate-900 truncate" title={t.nombre}>
                      {t.nombre}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 mt-3 truncate flex items-center gap-1.5 font-medium">
                  <Bot className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="truncate">{t.robotDefault}</span>
                </div>
              </div>
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Semanas Registradas ({teamSessions.length})
            </h3>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {isCreatingNew && (
              <div className="p-3.5 rounded-xl border border-blue-500 bg-blue-50 text-blue-900 text-xs font-bold flex items-center justify-between shadow-sm">
                <span>Nueva Sesión (En curso)</span>
                <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded text-white font-mono">Borrador</span>
              </div>
            )}

            {teamSessions.length === 0 && !isCreatingNew ? (
              <div className="p-5 rounded-2xl border border-slate-200 bg-white text-center text-xs text-slate-500 font-medium">
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
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${
                      isCurrentActive
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50/60 border-blue-300 border-l-4 border-l-blue-600 shadow-sm'
                        : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">Semana {session.semanaNumero}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase border ${
                            isRegional
                              ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
                              : 'bg-blue-100 text-blue-800 border-blue-200'
                          }`}
                        >
                          {isRegional ? '🏆 Regional' : '🛠️ Práctica'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
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
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
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
            <div className="p-12 rounded-3xl border border-slate-200 bg-white text-center shadow-sm">
              <Bot className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">Sin bitácoras para {selectedTeam?.nombre}</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">
                Aún no has registrado sesiones de entrenamiento o competencias para este equipo.
              </p>
              <button
                onClick={startNewSession}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Registrar Primera Semana (10 Rondas)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Gestión y Edición de Equipos (Registrados y por Registrar) */}
      <TeamManagerModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        initialTab={teamModalTab}
        focusTeamId={teamModalFocusId}
        onTeamUpdated={(updatedTeam) => {
          setTeamsVersion(v => v + 1);
          if (selectedTeamId === updatedTeam.id) {
            // Refresca la vista si el equipo seleccionado fue el editado
            setSelectedTeamId(updatedTeam.id);
          }
        }}
        onTeamCreated={(newTeam) => {
          setTeamsVersion(v => v + 1);
          setSelectedTeamId(newTeam.id);
          setActiveSessionId(null);
          setIsCreatingNew(false);
        }}
      />
    </div>
  );
};

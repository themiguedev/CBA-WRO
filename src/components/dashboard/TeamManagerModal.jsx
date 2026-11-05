import React, { useState, useEffect, useCallback } from 'react';
import { getTeams, getCategories, updateTeam, addTeam, deleteTeam } from '../../services/storageService';
import {
  X,
  Layers,
  PlusCircle,
  Pencil,
  Trash2,
  Check,
  Bot,
  AlertCircle,
  CheckCircle2,
  Search,
  Sparkles
} from 'lucide-react';

export const TeamManagerModal = ({
  isOpen,
  onClose,
  initialTab = 'list', // 'list' | 'create'
  focusTeamId = null,
  onTeamUpdated = null,
  onTeamCreated = null
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [teams, setTeams] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Estado de edición en línea de un equipo registrado
  const [editingTeamId, setEditingTeamId] = useState(focusTeamId);
  const [editNombre, setEditNombre] = useState('');
  const [editRobot, setEditRobot] = useState('');
  const [editCategoriaId, setEditCategoriaId] = useState('elementary');

  // Estado de creación de nuevo equipo (por registrar)
  const [newNombre, setNewNombre] = useState('');
  const [newCategoriaId, setNewCategoriaId] = useState('elementary');
  const [newRobot, setNewRobot] = useState('');

  // Notificaciones internas
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  const loadData = () => {
    const t = getTeams();
    const c = getCategories();
    setTeams(t);
    setCategories(c);
    return { teams: t, categories: c };
  };

  const startEditing = useCallback((teamId, teamList = null) => {
    const list = teamList || getTeams();
    const t = list.find(item => item.id === teamId);
    if (t) {
      setEditingTeamId(t.id);
      setEditNombre(t.nombre);
      setEditRobot(t.robotDefault || '');
      setEditCategoriaId(t.categoriaId);
      setFeedbackMsg({ type: '', text: '' });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      const { teams: t } = loadData();
      setActiveTab(initialTab);
      setFeedbackMsg({ type: '', text: '' });
      if (focusTeamId) {
        startEditing(focusTeamId, t);
      } else {
        setEditingTeamId(null);
      }
    }
  }, [isOpen, initialTab, focusTeamId, startEditing]);

  if (!isOpen) return null;

  const cancelEditing = () => {
    setEditingTeamId(null);
    setEditNombre('');
    setEditRobot('');
    setFeedbackMsg({ type: '', text: '' });
  };

  const handleSaveTeamEdit = (e) => {
    e?.preventDefault();
    if (!editNombre.trim()) {
      setFeedbackMsg({ type: 'error', text: 'El nombre del equipo no puede estar vacío.' });
      return;
    }

    // Verificar si otro equipo ya tiene ese nombre
    const duplicate = teams.some(
      t => t.id !== editingTeamId && t.nombre.toLowerCase().trim() === editNombre.toLowerCase().trim()
    );
    if (duplicate) {
      setFeedbackMsg({ type: 'error', text: `Ya existe otro equipo con el nombre "${editNombre.trim()}".` });
      return;
    }

    const updated = updateTeam(editingTeamId, {
      nombre: editNombre.trim(),
      robotDefault: editRobot.trim() || 'Prototipo',
      categoriaId: editCategoriaId
    });

    if (updated) {
      loadData();
      setEditingTeamId(null);
      setFeedbackMsg({ type: 'success', text: `¡Equipo "${updated.nombre}" actualizado correctamente!` });
      if (onTeamUpdated) onTeamUpdated(updated);
      setTimeout(() => setFeedbackMsg({ type: '', text: '' }), 3500);
    }
  };

  const handleCreateNewTeam = (e) => {
    e?.preventDefault();
    if (!newNombre.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Por favor ingresa un nombre para el nuevo equipo.' });
      return;
    }

    // Verificar si ya existe un equipo con ese nombre
    const duplicate = teams.some(
      t => t.nombre.toLowerCase().trim() === newNombre.toLowerCase().trim()
    );
    if (duplicate) {
      setFeedbackMsg({ type: 'error', text: `Ya existe un equipo registrado con el nombre "${newNombre.trim()}".` });
      return;
    }

    try {
      const created = addTeam({
        nombre: newNombre.trim(),
        categoriaId: newCategoriaId,
        robotDefault: newRobot.trim() || 'Robot-Pro'
      });

      loadData();
      setNewNombre('');
      setNewRobot('');
      setNewCategoriaId('elementary');
      setActiveTab('list');
      setFeedbackMsg({ type: 'success', text: `¡Nuevo equipo "${created.nombre}" registrado exitosamente!` });
      if (onTeamCreated) onTeamCreated(created);
      setTimeout(() => setFeedbackMsg({ type: '', text: '' }), 4000);
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Error al registrar el equipo' });
    }
  };

  const handleDeleteTeam = (teamId, teamName) => {
    if (teams.length <= 1) {
      setFeedbackMsg({ type: 'error', text: 'Debe haber al menos un equipo registrado en el sistema.' });
      return;
    }
    if (window.confirm(`¿Estás seguro de eliminar el equipo "${teamName}"?`)) {
      deleteTeam(teamId);
      loadData();
      setFeedbackMsg({ type: 'success', text: `Equipo "${teamName}" eliminado.` });
      setTimeout(() => setFeedbackMsg({ type: '', text: '' }), 3000);
    }
  };

  const filteredTeams = teams.filter(t =>
    t.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.robotDefault?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] relative">
        {/* Franja superior de color */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />

        {/* Header Modal */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 via-blue-50/20 to-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Gestión y Edición de Equipos
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Edita el nombre de equipos registrados o registra nuevos equipos WRO.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notificaciones */}
        {feedbackMsg.text && (
          <div
            className={`mx-6 mt-4 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Pestañas de Navegación */}
        <div className="px-6 pt-4 flex gap-2 border-b border-slate-100">
          <button
            onClick={() => {
              setActiveTab('list');
              setFeedbackMsg({ type: '', text: '' });
            }}
            className={`pb-3 px-3 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'list'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Equipos Registrados ({teams.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('create');
              setFeedbackMsg({ type: '', text: '' });
            }}
            className={`pb-3 px-3 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'create'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Registrar Nuevo Equipo</span>
          </button>
        </div>

        {/* Contenido según pestaña */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'list' ? (
            /* TAB 1: LISTA Y EDICIÓN DE EQUIPOS REGISTRADOS */
            <div className="space-y-4">
              {/* Barra de búsqueda rápida */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar equipo por nombre o robot..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none font-medium shadow-inner"
                />
              </div>

              <div className="space-y-2.5">
                {filteredTeams.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                    No se encontraron equipos que coincidan con la búsqueda.
                  </div>
                ) : (
                  filteredTeams.map((team) => {
                    const isEditing = editingTeamId === team.id;
                    const cat = categories.find(c => c.id === team.categoriaId);

                    return (
                      <div
                        key={team.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isEditing
                            ? 'bg-blue-50/70 border-blue-400 shadow-md ring-2 ring-blue-500/10'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {isEditing ? (
                          /* FORMULARIO DE EDICIÓN EN LÍNEA */
                          <form onSubmit={handleSaveTeamEdit} className="space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                              <span className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                                <Pencil className="w-3.5 h-3.5 text-blue-600" />
                                Editando Nombre del Equipo:
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">ID: {team.id}</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-extrabold text-slate-800 mb-1">
                                  Nombre del Equipo *
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={editNombre}
                                  onChange={(e) => setEditNombre(e.target.value)}
                                  placeholder="Nombre del equipo"
                                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-blue-300 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none font-bold"
                                  autoFocus
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-extrabold text-slate-800 mb-1">
                                  Robot Oficial por Defecto
                                </label>
                                <input
                                  type="text"
                                  value={editRobot}
                                  onChange={(e) => setEditRobot(e.target.value)}
                                  placeholder="Ej. MindBot-V2"
                                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-extrabold text-slate-800 mb-1">
                                  Categoría WRO
                                </label>
                                <select
                                  value={editCategoriaId}
                                  onChange={(e) => setEditCategoriaId(e.target.value)}
                                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-blue-600 focus:outline-none font-semibold cursor-pointer"
                                >
                                  {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                      {c.nombre} ({c.edad})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                              <button
                                type="button"
                                onClick={cancelEditing}
                                className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
                              >
                                Cancelar
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Guardar Nombre
                              </button>
                            </div>
                          </form>
                        ) : (
                          /* VISTA DE INFORMACIÓN DEL EQUIPO */
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${team.color || 'from-blue-600 to-cyan-500'} p-0.5 shadow-sm shrink-0`}>
                                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                                  <Bot className="w-5 h-5 text-slate-700" />
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-black text-slate-900">
                                    {team.nombre}
                                  </h4>
                                  <span
                                    className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                      team.categoriaId === 'junior'
                                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                                    }`}
                                  >
                                    {cat?.nombre}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5 font-medium flex items-center gap-1.5">
                                  <span>Robot: <strong>{team.robotDefault}</strong></span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => startEditing(team.id)}
                                className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/80 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                                title="Editar nombre de este equipo"
                              >
                                <Pencil className="w-3 h-3" />
                                <span>Editar</span>
                              </button>

                              {teams.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTeam(team.id, team.nombre)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                                  title="Eliminar equipo"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            /* TAB 2: REGISTRAR NUEVO EQUIPO (POR REGISTRAR) */
            <form onSubmit={handleCreateNewTeam} className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-xs">
                <div className="flex items-center gap-2 font-black text-emerald-950 mb-1">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Registrar Equipo Nuevo para Temporada WRO
                </div>
                Ingresa el nombre del equipo por registrar. Una vez registrado, estará disponible en las bitácoras, el ranking por categorías y para la vinculación de alumnos y representantes.
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                  Nombre del Nuevo Equipo *
                </label>
                <input
                  type="text"
                  required
                  value={newNombre}
                  onChange={(e) => setNewNombre(e.target.value)}
                  placeholder="Ej. Megabots CBA, ZuliaRobotics, etc."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:outline-none font-bold shadow-sm"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                    Categoría Oficial WRO *
                  </label>
                  <select
                    value={newCategoriaId}
                    onChange={(e) => setNewCategoriaId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-emerald-600 focus:outline-none font-semibold cursor-pointer shadow-sm"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} ({c.edad})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                    Nombre del Robot por Defecto
                  </label>
                  <input
                    type="text"
                    value={newRobot}
                    onChange={(e) => setNewRobot(e.target.value)}
                    placeholder="Ej. MegaRex-1"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-none font-medium shadow-sm"
                  />
                </div>
              </div>

              {/* Vista previa en vivo */}
              {newNombre.trim() && (
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Vista Previa de la Tarjeta</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">{newNombre.trim()}</span>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      {categories.find(c => c.id === newCategoriaId)?.nombre}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Robot: <strong>{newRobot.trim() || 'Robot-Pro'}</strong>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  Registrar y Guardar Nuevo Equipo
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Modal */}
        <div className="p-4 px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>{teams.length} equipos en la base de datos local</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

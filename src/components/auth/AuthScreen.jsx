import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTeams, updateTeam, addTeam } from '../../services/storageService';
import {
  Bot,
  Users,
  LogIn,
  UserPlus,
  KeyRound,
  Mail,
  User,
  Layers,
  ArrowRight,
  CheckCircle2,
  Pencil,
  Plus,
  Check,
  X
} from 'lucide-react';
import logoImg from '../../assets/logo.jpg';
import { CoinLogo } from '../ui/CoinLogo';

export const AuthScreen = () => {
  const { login, register } = useAuth();
  const [teams, setTeams] = useState(() => getTeams());

  useEffect(() => {
    const handleTeamsUpdate = () => {
      setTeams(getTeams());
    };
    window.addEventListener('cba_teams_updated', handleTeamsUpdate);
    return () => window.removeEventListener('cba_teams_updated', handleTeamsUpdate);
  }, []);

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regNombre, setRegNombre] = useState('');
  const [regApellido, setRegApellido] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRol, setRegRol] = useState('alumno'); // 'alumno' | 'representante'
  const [regEquipoId, setRegEquipoId] = useState(teams[0]?.id || 'robotex');

  // Estado para editar nombre de equipo registrado
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [editedTeamName, setEditedTeamName] = useState('');

  // Estado para registrar nuevo equipo (por registrar)
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamCat, setNewTeamCat] = useState('elementary');
  const [newTeamRobot, setNewTeamRobot] = useState('');

  const [teamNotice, setTeamNotice] = useState('');

  // Asegurar que si el equipo seleccionado no existe, usar el primero disponible
  useEffect(() => {
    if (teams.length > 0 && !teams.some(t => t.id === regEquipoId)) {
      setRegEquipoId(teams[0].id);
    }
  }, [teams, regEquipoId]);

  const selectedTeam = teams.find(t => t.id === regEquipoId) || teams[0];

  const handleStartEditTeam = () => {
    if (selectedTeam) {
      setEditedTeamName(selectedTeam.nombre);
      setIsEditingTeam(true);
      setIsCreatingTeam(false);
      setTeamNotice('');
    }
  };

  const handleSaveEditedTeamName = (e) => {
    e?.preventDefault();
    if (!editedTeamName.trim()) {
      setTeamNotice('El nombre no puede estar vacío.');
      return;
    }

    const updated = updateTeam(selectedTeam.id, { nombre: editedTeamName.trim() });
    if (updated) {
      setTeams(getTeams());
      setIsEditingTeam(false);
      setTeamNotice(`¡Nombre actualizado a "${updated.nombre}"!`);
      setTimeout(() => setTeamNotice(''), 3500);
    }
  };

  const handleCreateAndSelectNewTeam = (e) => {
    e?.preventDefault();
    if (!newTeamName.trim()) {
      setTeamNotice('Ingresa un nombre para el nuevo equipo.');
      return;
    }

    try {
      const created = addTeam({
        nombre: newTeamName.trim(),
        categoriaId: newTeamCat,
        robotDefault: newTeamRobot.trim() || 'Robot-Pro'
      });

      const updatedList = getTeams();
      setTeams(updatedList);
      setRegEquipoId(created.id);
      setIsCreatingTeam(false);
      setNewTeamName('');
      setNewTeamRobot('');
      setTeamNotice(`¡Nuevo equipo "${created.nombre}" registrado y seleccionado!`);
      setTimeout(() => setTeamNotice(''), 4000);
    } catch (err) {
      setTeamNotice(err.message || 'Error al registrar nuevo equipo');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(loginEmail, loginPassword);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regNombre.trim() || !regApellido.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg('Por favor completa todos los campos para el registro');
      return;
    }

    const res = register({
      nombre: regNombre.trim(),
      apellido: regApellido.trim(),
      email: regEmail.trim(),
      password: regPassword,
      rol: regRol,
      equipoId: regEquipoId
    });

    if (res.success) {
      setSuccessMsg('¡Cuenta registrada exitosamente! Ingresando...');
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col lg:grid lg:grid-cols-12 selection:bg-blue-600 selection:text-white">
      {/* Columna Izquierda: Banner & Identidad WRO (Desktop & Tablet) */}
      <div className="relative lg:col-span-5 xl:col-span-6 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-8 sm:p-12 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-blue-900/60 overflow-hidden text-white">
        {/* Glows decorativos */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header de Identidad */}
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <CoinLogo
              size="w-16 h-16 sm:w-20 sm:h-20"
              ringClass="border-2 border-white/90 shadow-2xl shadow-blue-500/50 ring-4 ring-blue-500/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl sm:text-2xl tracking-wider text-white">TEAM BELLAS ARTES</span>
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/30 text-cyan-300 border border-cyan-400/30">
                  BOTS
                </span>
              </div>
              <p className="text-xs text-blue-200/80 font-medium mt-0.5">WRO Venezuela Competition Tracking</p>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 max-w-lg">

            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight">
              Control Semanal de Equipos WRO
            </h1>

            <p className="mt-4 text-sm sm:text-base text-blue-100/80 leading-relaxed font-normal">
              Plataforma digital para la evaluación de rondas, análisis de tiempos, fallas mecánicas y soluciones de ingeniería rumbo a las Regionales WRO.
            </p>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Formulario de Login / Registro a Pantalla Completa (Luminoso con sutil color) */}
      <div className="lg:col-span-7 xl:col-span-6 flex items-center justify-center p-6 sm:p-10 lg:p-16 relative bg-gradient-to-br from-slate-50 via-sky-50/25 to-indigo-50/20">
        <div className="w-full max-w-md space-y-6">
          {/* Header del Formulario */}
          <div className="text-center">
            {/* Logo en versión móvil cuando el banner lateral está arriba */}
            <div className="flex items-center justify-center gap-3 mb-5 lg:hidden">
              <CoinLogo
                size="w-12 h-12"
                ringClass="border-2 border-blue-600 shadow-md shadow-blue-500/20"
              />
              <div className="text-left">
                <h3 className="font-black text-sm text-slate-900">TEAM BELLAS ARTES BOTS</h3>
                <p className="text-[11px] text-slate-500">WRO Venezuela Competition Tracking</p>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight text-center">
              {mode === 'login' ? 'Iniciar Sesión' : 'Crear una Cuenta'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-medium text-center">
              {mode === 'login'
                ? 'Ingresa tus credenciales para acceder a tu panel de seguimiento.'
                : 'Regístrate como alumno o representante seleccionando tu equipo.'}
            </p>

            {/* Selector de Pestañas: Login vs Registro con estilo de color */}
            <div className="flex p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300 mt-5 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                  mode === 'login'
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-4 h-4" />
                Iniciar Sesión
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                  mode === 'register'
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Registro Nuevo
              </button>
            </div>
          </div>

          {/* Notificaciones de Error / Éxito */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold text-center">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {successMsg}
            </div>
          )}

          {/* VISTA 1: INICIAR SESIÓN */}
          {mode === 'login' ? (
            <div className="space-y-6">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="admin@cbawro.edu o tu correo de alumno"
                      className="w-full pl-10 pr-3.5 py-3 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition shadow-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3.5 py-3 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition shadow-sm font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Ingresar a la Plataforma</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="pt-6 border-t border-slate-200">
                <p className="text-[11px] text-slate-500 text-center mt-3 font-medium">
                  Los alumnos y representantes deben registrarse en la pestaña <strong>Registro Nuevo</strong> seleccionando su equipo correspondiente.
                </p>
              </div>
            </div>
          ) : (
            /* VISTA 2: REGISTRO PARA ALUMNOS Y REPRESENTANTES */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Selección de Rol */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                  ¿Qué tipo de usuario eres?
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRegRol('alumno')}
                    className={`p-3 rounded-xl border text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer ${
                      regRol === 'alumno'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md shadow-blue-500/25 scale-[1.02]'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Bot className="w-4 h-4" />
                    Alumno
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRol('representante')}
                    className={`p-3 rounded-xl border text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer ${
                      regRol === 'representante'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-md shadow-emerald-500/25 scale-[1.02]'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Representante
                  </button>
                </div>
              </div>

              {/* Nombre y Apellido */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                    Nombre
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={regNombre}
                      onChange={(e) => setRegNombre(e.target.value)}
                      placeholder="Carlos"
                      className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none font-medium shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                    Apellido
                  </label>
                  <input
                    type="text"
                    required
                    value={regApellido}
                    onChange={(e) => setRegApellido(e.target.value)}
                    placeholder="Mendoza"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none font-medium shadow-sm"
                  />
                </div>
              </div>

              {/* Desplegable de Equipos con Opciones de Edición y Registro */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-extrabold text-slate-800">
                    Selecciona tu Equipo
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (isEditingTeam) {
                          setIsEditingTeam(false);
                        } else {
                          handleStartEditTeam();
                        }
                      }}
                      className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 transition cursor-pointer px-2 py-0.5 rounded-lg bg-blue-50 border border-blue-200"
                      title="Editar el nombre del equipo seleccionado"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>{isEditingTeam ? 'Cerrar edición' : 'Editar nombre'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingTeam(!isCreatingTeam);
                        setIsEditingTeam(false);
                        setTeamNotice('');
                      }}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition cursor-pointer px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200"
                      title="Registrar un nuevo equipo"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isCreatingTeam ? 'Cerrar' : 'Nuevo equipo'}</span>
                    </button>
                  </div>
                </div>

                {/* Notificación de acción en equipos */}
                {teamNotice && (
                  <div className="mb-2 p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold flex items-center gap-1.5 animate-fadeIn">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{teamNotice}</span>
                  </div>
                )}

                {/* Caja de Edición de Nombre del Equipo Registrado */}
                {isEditingTeam && selectedTeam && (
                  <div className="mb-3 p-3 rounded-2xl bg-blue-50/80 border border-blue-300 space-y-2 animate-fadeIn shadow-sm">
                    <div className="text-[11px] font-black text-blue-950 flex items-center gap-1.5">
                      <Pencil className="w-3.5 h-3.5 text-blue-600" />
                      <span>Editar nombre para: <strong className="text-blue-800">{selectedTeam.nombre}</strong></span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editedTeamName}
                        onChange={(e) => setEditedTeamName(e.target.value)}
                        placeholder="Nuevo nombre del equipo"
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white border border-blue-300 text-slate-900 focus:border-blue-600 focus:outline-none font-bold"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleSaveEditedTeamName}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingTeam(false)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Caja para Registrar Nuevo Equipo (Por Registrar) */}
                {isCreatingTeam && (
                  <div className="mb-3 p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-300 space-y-2.5 animate-fadeIn shadow-sm">
                    <div className="text-[11px] font-black text-emerald-950 flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Registrar Nuevo Equipo (por registrar):</span>
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold text-emerald-900 uppercase block mb-0.5">
                        Nombre del Equipo *
                      </label>
                      <input
                        type="text"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        placeholder="Ej. Megabots CBA"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-emerald-300 text-slate-900 focus:border-emerald-600 focus:outline-none font-bold"
                        autoFocus
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-extrabold text-emerald-900 uppercase block mb-0.5">
                          Categoría WRO
                        </label>
                        <select
                          value={newTeamCat}
                          onChange={(e) => setNewTeamCat(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white border border-emerald-300 text-slate-900 focus:border-emerald-600 focus:outline-none font-semibold cursor-pointer"
                        >
                          <option value="elementary">Elementary (8-12)</option>
                          <option value="junior">Junior (13-15)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-extrabold text-emerald-900 uppercase block mb-0.5">
                          Robot Oficial
                        </label>
                        <input
                          type="text"
                          value={newTeamRobot}
                          onChange={(e) => setNewTeamRobot(e.target.value)}
                          placeholder="Ej. MegaBot-1"
                          className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white border border-emerald-300 text-slate-900 focus:border-emerald-600 focus:outline-none font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleCreateAndSelectNewTeam}
                        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Registrar y Seleccionar
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCreatingTeam(false)}
                        className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <select
                    value={regEquipoId}
                    onChange={(e) => {
                      if (e.target.value === '__NEW_TEAM__') {
                        setIsCreatingTeam(true);
                        setIsEditingTeam(false);
                      } else {
                        setRegEquipoId(e.target.value);
                        setIsEditingTeam(false);
                      }
                    }}
                    className="w-full px-3.5 py-3 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-blue-600 focus:outline-none appearance-none cursor-pointer font-bold shadow-sm"
                  >
                    <optgroup label="Categoría Elementary (8 - 12 años)" className="bg-slate-100 text-blue-900 font-bold">
                      {teams
                        .filter(t => t.categoriaId === 'elementary')
                        .map(t => (
                          <option key={t.id} value={t.id} className="text-slate-900 font-medium">
                            {t.nombre} (Robot: {t.robotDefault})
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Categoría Junior (13 - 15 años)" className="bg-slate-100 text-rose-900 font-bold">
                      {teams
                        .filter(t => t.categoriaId === 'junior')
                        .map(t => (
                          <option key={t.id} value={t.id} className="text-slate-900 font-medium">
                            {t.nombre} (Robot: {t.robotDefault})
                          </option>
                        ))}
                    </optgroup>
                    <option value="__NEW_TEAM__" className="text-emerald-700 font-extrabold bg-emerald-50">
                      + Registrar un nuevo equipo...
                    </option>
                  </select>
                  <Layers className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">
                  Tu usuario quedará vinculado a este equipo para consultar sus bitácoras de entrenamiento.
                </p>
              </div>

              {/* Correo y Contraseña */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="usuario@robotica.edu"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none font-medium shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Define tu contraseña"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none font-medium shadow-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-500/25 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Completar Registro y Entrar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

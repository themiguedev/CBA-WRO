import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTeams } from '../../services/storageService';
import {
  Bot,
  Users,
  ShieldCheck,
  LogIn,
  UserPlus,
  KeyRound,
  Mail,
  User,
  Layers,
  Sparkles,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

export const AuthScreen = () => {
  const { login, register, switchUserFast } = useAuth();
  const teams = getTeams();

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
      <div className="relative lg:col-span-5 xl:col-span-6 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-blue-900/60 overflow-hidden text-white">
        {/* Glows decorativos */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header de Identidad */}
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={logoImg}
              alt="Team Bellas Artes Bots"
              className="h-16 w-16 rounded-full object-cover border-2 border-white/80 shadow-2xl shadow-blue-500/40 ring-4 ring-blue-500/30"
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              Temporada Oficial de Robótica
            </div>

            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight">
              Bitácora Técnica & Control Semanal de Equipos
            </h1>

            <p className="mt-4 text-sm sm:text-base text-blue-100/80 leading-relaxed font-normal">
              Plataforma digital para la evaluación de rondas, análisis de tiempos, fallas mecánicas y soluciones de ingeniería rumbo a las Regionales WRO.
            </p>
          </div>
        </div>

        {/* Puntos Clave de la Plataforma */}
        <div className="relative z-10 my-8 space-y-3 max-w-md hidden sm:block">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <div className="p-2 rounded-xl bg-blue-500/30 text-cyan-300 mt-0.5">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Digitalización Fiel de 10 Rondas</h4>
              <p className="text-[11px] text-blue-100/70 mt-0.5">
                Seguimiento de tiempos, puntajes y bitácora de ingeniería por ronda para cada robot.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <div className="p-2 rounded-xl bg-amber-400/30 text-amber-300 mt-0.5">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Clasificación por Categorías WRO</h4>
              <p className="text-[11px] text-blue-100/70 mt-0.5">
                Evaluación comparativa de récords en Elementary y Junior para representantes.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Izquierdo */}
        <div className="relative z-10 text-xs text-blue-200/70 flex items-center justify-between pt-6 border-t border-white/15">
          <span>Equipos: Robotex, Pinbots, Cyberminds, Bluemachine, Catatumbots, Cyberbots</span>
        </div>
      </div>

      {/* Columna Derecha: Formulario de Login / Registro a Pantalla Completa (Luminoso) */}
      <div className="lg:col-span-7 xl:col-span-6 flex items-center justify-center p-6 sm:p-10 lg:p-16 relative bg-slate-50/90">
        <div className="w-full max-w-md space-y-6">
          {/* Header del Formulario */}
          <div>
            {/* Logo en versión móvil cuando el banner lateral está arriba */}
            <div className="flex items-center gap-3 mb-5 lg:hidden">
              <img
                src={logoImg}
                alt="Team Bellas Artes Bots"
                className="h-12 w-12 rounded-full object-cover border-2 border-blue-600 shadow-md shadow-blue-500/20"
              />
              <div>
                <h3 className="font-black text-sm text-slate-900">TEAM BELLAS ARTES BOTS</h3>
                <p className="text-[11px] text-slate-500">WRO Venezuela Competition Tracking</p>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {mode === 'login' ? 'Iniciar Sesión' : 'Crear una Cuenta'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              {mode === 'login'
                ? 'Ingresa tus credenciales para acceder a tu panel de seguimiento.'
                : 'Regístrate como alumno o representante seleccionando tu equipo.'}
            </p>

            {/* Selector de Pestañas: Login vs Registro */}
            <div className="flex p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300 mt-5">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                  mode === 'login'
                    ? 'bg-blue-600 text-white shadow-sm'
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
                    ? 'bg-blue-600 text-white shadow-sm'
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

              {/* Acceso Rápido para Profesor/Admin */}
              <div className="pt-6 border-t border-slate-200">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 text-center mb-3">
                  Acceso Docente Preconfigurado
                </div>

                <button
                  type="button"
                  onClick={() => switchUserFast('user_admin')}
                  className="w-full p-4 rounded-2xl bg-purple-50/80 border border-purple-200 hover:bg-purple-100/90 transition flex items-center justify-between cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-600 text-white shadow-sm">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-black text-purple-900">Entrar como Profesor (Admin)</div>
                      <div className="text-[11px] text-purple-700 font-medium mt-0.5">admin@cbawro.edu • Clave: admin</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-700 group-hover:translate-x-1 transition" />
                </button>

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
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
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
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
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

              {/* Desplegable de Equipos */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>Selecciona tu Equipo</span>
                  <span className="text-[10px] text-blue-700 font-bold">WRO Venezuela</span>
                </label>
                <div className="relative">
                  <select
                    value={regEquipoId}
                    onChange={(e) => setRegEquipoId(e.target.value)}
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

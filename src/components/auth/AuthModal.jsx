import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTeams, getCategories } from '../../services/storageService';
import { Bot, Users, ShieldCheck, X, LogIn, UserPlus, KeyRound, Mail, User, Layers } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, switchUserFast } = useAuth();
  const teams = getTeams();
  const categories = getCategories();

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

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(loginEmail, loginPassword);
    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regNombre || !regApellido || !regEmail || !regPassword) {
      setErrorMsg('Por favor completa todos los campos');
      return;
    }

    const res = register({
      nombre: regNombre,
      apellido: regApellido,
      email: regEmail,
      password: regPassword,
      rol: regRol,
      equipoId: regEquipoId
    });

    if (res.success) {
      setSuccessMsg('¡Cuenta creada con éxito! Redirigiendo...');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleFastDemoLogin = (userId) => {
    switchUserFast(userId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Modal */}
        <div className="text-center mb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-[2px] mx-auto mb-3 shadow-lg shadow-blue-600/30">
            <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Bot className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-xl font-black text-white">Plataforma CBA WRO</h2>
          <p className="text-xs text-slate-400 mt-1">
            Sistema de seguimiento para Regionales WRO Venezuela
          </p>

          {/* Toggle Login / Registro */}
          <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800 mt-4">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Iniciar Sesión
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Registrarse
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center font-medium">
            {successMsg}
          </div>
        )}

        {/* MODO INICIAR SESIÓN */}
        {mode === 'login' ? (
          <div>
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="ej: profesor@cbawro.edu"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 transition cursor-pointer"
              >
                Ingresar al Sistema
              </button>
            </form>

            {/* Accesos rápidos de prueba */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 text-center mb-2.5">
                O ingresa rápidamente con una cuenta de prueba:
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleFastDemoLogin('user_admin')}
                  className="p-2 rounded-lg bg-slate-950 border border-purple-500/30 hover:border-purple-500 text-[11px] font-bold text-purple-400 transition text-center"
                >
                  Profesor
                </button>
                <button
                  type="button"
                  onClick={() => handleFastDemoLogin('user_alumno_robotex')}
                  className="p-2 rounded-lg bg-slate-950 border border-blue-500/30 hover:border-blue-500 text-[11px] font-bold text-blue-400 transition text-center"
                >
                  Alumno
                </button>
                <button
                  type="button"
                  onClick={() => handleFastDemoLogin('user_repre_robotex')}
                  className="p-2 rounded-lg bg-slate-950 border border-emerald-500/30 hover:border-emerald-500 text-[11px] font-bold text-emerald-400 transition text-center"
                >
                  Representante
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* MODO REGISTRO PARA ALUMNOS Y REPRESENTANTES */
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            {/* Selección de Rol */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ¿Qué tipo de usuario eres?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegRol('alumno')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    regRol === 'alumno'
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  Alumno
                </button>

                <button
                  type="button"
                  onClick={() => setRegRol('representante')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    regRol === 'representante'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  Representante
                </button>
              </div>
            </div>

            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  value={regNombre}
                  onChange={(e) => setRegNombre(e.target.value)}
                  placeholder="Carlos"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  required
                  value={regApellido}
                  onChange={(e) => setRegApellido(e.target.value)}
                  placeholder="Mendoza"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Selección de Equipo Desplegable (Agrupado por Categorías) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Selecciona tu Equipo de Robótica</span>
                <span className="text-[10px] text-blue-400 font-normal">WRO Venezuela</span>
              </label>
              <div className="relative">
                <select
                  value={regEquipoId}
                  onChange={(e) => setRegEquipoId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
                >
                  <optgroup label="Categoría Elementary (8 - 12 años)" className="bg-slate-900 text-cyan-400 font-bold">
                    {teams
                      .filter(t => t.categoriaId === 'elementary')
                      .map(t => (
                        <option key={t.id} value={t.id} className="text-white font-normal">
                          {t.nombre} (Robot: {t.robotDefault})
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Categoría Junior (13 - 15 años)" className="bg-slate-900 text-rose-400 font-bold">
                    {teams
                      .filter(t => t.categoriaId === 'junior')
                      .map(t => (
                        <option key={t.id} value={t.id} className="text-white font-normal">
                          {t.nombre} (Robot: {t.robotDefault})
                        </option>
                      ))}
                  </optgroup>
                </select>
                <Layers className="w-4 h-4 text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Alumnos y representantes solo tienen acceso al seguimiento de su equipo seleccionado.
              </p>
            </div>

            {/* Correo y Contraseña */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="alumno@robotica.edu"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Crea una contraseña segura"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 transition cursor-pointer"
            >
              Completar Registro y Entrar
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bot, LogOut, ShieldCheck, UserCheck, Users, Trophy } from 'lucide-react';

export const Navbar = ({ onOpenAuthModal }) => {
  const { currentUser, userTeam, logout, switchUserFast } = useAuth();

  const getRoleBadge = (rol) => {
    switch (rol) {
      case 'admin':
        return {
          label: 'Profesor / Admin',
          color: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          icon: ShieldCheck
        };
      case 'alumno':
        return {
          label: 'Alumno',
          color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          icon: Bot
        };
      case 'representante':
        return {
          label: 'Representante',
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: Users
        };
      default:
        return {
          label: 'Invitado',
          color: 'bg-slate-800 text-slate-300 border-slate-700',
          icon: UserCheck
        };
    }
  };

  const roleInfo = currentUser ? getRoleBadge(currentUser.rol) : null;
  const RoleIcon = roleInfo?.icon;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[2px] shadow-lg shadow-blue-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-wider text-white">CBA WRO</span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Venezuela
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Bitácora Técnica & Seguimiento de Competencia</p>
          </div>
        </div>

        {/* Demo Fast Switcher & Profile */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              {/* Selector Rápido de Demostración */}
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-500 font-medium mr-1">Probar como:</span>
                <button
                  onClick={() => switchUserFast('user_admin')}
                  className={`px-2 py-0.5 rounded transition ${
                    currentUser.rol === 'admin'
                      ? 'bg-purple-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Profesor
                </button>
                <button
                  onClick={() => switchUserFast('user_alumno_robotex')}
                  className={`px-2 py-0.5 rounded transition ${
                    currentUser.rol === 'alumno'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Alumno (Robotex)
                </button>
                <button
                  onClick={() => switchUserFast('user_repre_robotex')}
                  className={`px-2 py-0.5 rounded transition ${
                    currentUser.rol === 'representante'
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Representante
                </button>
              </div>

              {/* Usuario actual */}
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
                <div className="text-right hidden md:block">
                  <div className="text-sm font-semibold text-slate-200 leading-tight">
                    {currentUser.nombre} {currentUser.apellido}
                  </div>
                  <div className="flex items-center justify-end gap-1.5 mt-0.5">
                    {userTeam && (
                      <span className="text-xs text-slate-400">
                        Equipo: <strong className="text-slate-300">{userTeam.nombre}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${roleInfo.color}`}>
                  <RoleIcon className="w-3.5 h-3.5" />
                  <span>{roleInfo.label}</span>
                </div>

                <button
                  onClick={logout}
                  title="Cerrar Sesión"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 transition shadow-lg shadow-blue-600/25"
            >
              Iniciar Sesión / Registro
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

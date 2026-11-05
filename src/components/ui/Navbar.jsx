import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bot, LogOut, ShieldCheck, UserCheck, Users } from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

export const Navbar = () => {
  const { currentUser, userTeam, logout } = useAuth();

  const getRoleBadge = (rol) => {
    switch (rol) {
      case 'admin':
        return {
          label: 'Profesor / Admin',
          color: 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-900 border-purple-300 shadow-sm shadow-purple-500/10',
          icon: ShieldCheck
        };
      case 'alumno':
        return {
          label: 'Alumno',
          color: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-900 border-blue-300 shadow-sm shadow-blue-500/10',
          icon: Bot
        };
      case 'representante':
        return {
          label: 'Representante',
          color: 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-900 border-emerald-300 shadow-sm shadow-emerald-500/10',
          icon: Users
        };
      default:
        return {
          label: 'Invitado',
          color: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: UserCheck
        };
    }
  };

  const roleInfo = currentUser ? getRoleBadge(currentUser.rol) : null;
  const RoleIcon = roleInfo?.icon;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-sm">
      {/* Línea superior con gradiente tecnológico vibrante */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={logoImg}
              alt="Team Bellas Artes Bots"
              className="h-11 w-11 rounded-full object-cover border-2 border-blue-600 shadow-md shadow-blue-500/30 ring-2 ring-blue-200"
            />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" title="En línea" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900">TEAM BELLAS ARTES</span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/20">
                BOTS
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">Bitácora Técnica & Seguimiento WRO Venezuela</p>
          </div>
        </div>

        {/* Profile & Logout */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2.5">
              {/* Usuario actual */}
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-900 leading-tight">
                  {currentUser.nombre} {currentUser.apellido}
                </div>
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                  {userTeam && (
                    <span className="text-xs text-slate-500 font-medium flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full bg-gradient-to-r ${userTeam.color || 'from-blue-600 to-cyan-500'} mr-1.5`} />
                      Equipo: <strong className="text-blue-700 font-bold ml-1">{userTeam.nombre}</strong>
                    </span>
                  )}
                </div>
              </div>

              <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${roleInfo.color}`}>
                <RoleIcon className="w-3.5 h-3.5" />
                <span>{roleInfo.label}</span>
              </div>

              <button
                onClick={logout}
                title="Cerrar Sesión"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 border border-slate-200 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

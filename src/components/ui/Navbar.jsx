import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bot, LogOut, ShieldCheck, UserCheck, Users, Trophy } from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

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
          <img
            src={logoImg}
            alt="Team Bellas Artes Bots"
            className="h-10 w-10 rounded-full object-cover border-2 border-blue-500/50 shadow-md shadow-blue-500/30 ring-2 ring-blue-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-wider text-white">TEAM BELLAS ARTES</span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                BOTS
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Bitácora Técnica & Seguimiento WRO</p>
          </div>
        </div>

        {/* Profile & Logout */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              {/* Usuario actual */}
              <div className="flex items-center gap-2.5">
                <div className="text-right hidden sm:block">
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
};

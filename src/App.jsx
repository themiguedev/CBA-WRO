import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/ui/Navbar';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { ParentDashboard } from './components/dashboard/ParentDashboard';
import { AuthScreen } from './components/auth/AuthScreen';
import { getTeams } from './services/storageService';

const MainContent = () => {
  const { currentUser } = useAuth();
  const [teams, setTeams] = useState(() => getTeams());

  useEffect(() => {
    const handleTeamsUpdate = () => {
      setTeams(getTeams());
    };
    window.addEventListener('cba_teams_updated', handleTeamsUpdate);
    return () => window.removeEventListener('cba_teams_updated', handleTeamsUpdate);
  }, []);

  // Si no hay sesión iniciada, mostrar la pantalla completa de login/registro
  if (!currentUser) {
    return <AuthScreen />;
  }

  // Si está autenticado, renderizar la interfaz principal según el rol
  const renderDashboardByRole = () => {
    switch (currentUser.rol) {
      case 'admin':
        return <AdminDashboard />;
      case 'alumno':
        return <StudentDashboard />;
      case 'representante':
        return <ParentDashboard />;
      default:
        return (
          <div className="p-8 text-center text-slate-500 font-medium">
            Rol no reconocido en el sistema.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50/40 to-indigo-50/30 text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Luces y ambientación decorativa sutil con color */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-sky-400/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
          {renderDashboardByRole()}
        </main>
      </div>

      {/* Footer limpio con detalle de color superior */}
      <footer className="relative z-10 border-t border-slate-200/90 bg-white/90 backdrop-blur-md py-6 text-center text-xs text-slate-500">
        <div className="h-0.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 absolute top-0 left-0" />
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">Team Bellas Artes Bots • CBA WRO</span>
            <span>•</span>
            <span className="text-slate-600">Bitácora Técnica de Competencia WRO Venezuela</span>
          </div>
          <div className="text-slate-500 text-[11px] font-medium">
            Equipos: {teams.map(t => t.nombre).join(', ')}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

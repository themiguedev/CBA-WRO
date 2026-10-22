import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/ui/Navbar';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { ParentDashboard } from './components/dashboard/ParentDashboard';
import { AuthScreen } from './components/auth/AuthScreen';

const MainContent = () => {
  const { currentUser } = useAuth();

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
          <div className="p-8 text-center text-slate-400">
            Rol no reconocido en el sistema.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      <div>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
          {renderDashboardByRole()}
        </main>
      </div>

      {/* Footer minimalista */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">CBA WRO Tracker</span>
            <span>•</span>
            <span>Bitácora de Funcionalidad Técnica WRO Venezuela</span>
          </div>
          <div className="text-slate-600">
            Categorías Elementary (Robotex, Pinbots, Cyberminds, Bluemachine, Catatumbots) y Junior (Cyberbots)
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

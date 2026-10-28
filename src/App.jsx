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
          <div className="p-8 text-center text-slate-500 font-medium">
            Rol no reconocido en el sistema.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      <div>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
          {renderDashboardByRole()}
        </main>
      </div>

      {/* Footer limpio y de alto contraste */}
      <footer className="border-t border-slate-200 bg-white/90 backdrop-blur-sm py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">Team Bellas Artes Bots • CBA WRO</span>
            <span>•</span>
            <span>Bitácora Técnica de Competencia WRO Venezuela</span>
          </div>
          <div className="text-slate-500">
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

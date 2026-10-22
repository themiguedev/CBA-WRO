import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/ui/Navbar';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { ParentDashboard } from './components/dashboard/ParentDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { Bot, ShieldCheck, Users, Trophy, Sparkles, ArrowRight } from 'lucide-react';

const MainContent = () => {
  const { currentUser } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Renderizado dinámico según el rol autenticado
  const renderDashboardByRole = () => {
    if (!currentUser) {
      return (
        <div className="py-16 sm:py-24 text-center max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            World Robot Olympiad • Venezuela
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Bitácora Técnica & Seguimiento de Competencia <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">WRO</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Plataforma digital para entrenadores, alumnos y representantes. Registra las 10 rondas técnicas, tiempos, puntuaciones y bitácora de ingeniería de cada equipo rumbo a las Regionales.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Acceder al Sistema</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Tarjetas informativas de los roles */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Profesores (Admin)</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Control y edición total de las tablas de bitácora técnica de 10 rondas para todas las categorías y equipos.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-4">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Alumnos</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Consulta exclusiva de su equipo con su récord histórico, tiempos y registro de fallas y soluciones de ingeniería.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Representantes</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Seguimiento del equipo de su representado y acceso exclusivo a la tabla clasificatoria por categoría.
              </p>
            </div>
          </div>
        </div>
      );
    }

    switch (currentUser.rol) {
      case 'admin':
        return <AdminDashboard />;
      case 'alumno':
        return <StudentDashboard />;
      case 'representante':
        return <ParentDashboard />;
      default:
        return <div>Rol no reconocido.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      <div>
        <Navbar onOpenAuthModal={() => setIsAuthModalOpen(true)} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderDashboardByRole()}
        </main>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

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

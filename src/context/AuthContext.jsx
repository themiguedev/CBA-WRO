import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUsers, registerUser, getTeamById, initStorage } from '../services/storageService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    initStorage();
    const saved = localStorage.getItem('cba_wro_active_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Por defecto inicia en la pantalla completa de login
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cba_wro_active_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cba_wro_active_user');
    }
  }, [currentUser]);

  const login = (email, password) => {
    const users = getUsers();
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );

    if (found) {
      setCurrentUser(found);
      return { success: true };
    }
    return { success: false, message: 'Correo o contraseña incorrectos' };
  };

  const register = ({ nombre, apellido, email, password, rol, equipoId }) => {
    const users = getUsers();
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (exists) {
      return { success: false, message: 'Este correo electrónico ya está registrado' };
    }

    const newUser = registerUser({
      nombre,
      apellido,
      email: email.toLowerCase().trim(),
      password,
      rol, // 'alumno' | 'representante'
      equipoId: rol === 'admin' ? null : equipoId
    });

    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Selector de roles rápido para pruebas inmediatas
  const switchUserFast = (userId) => {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const userTeam = currentUser?.equipoId ? getTeamById(currentUser.equipoId) : null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userTeam,
        login,
        register,
        logout,
        switchUserFast
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

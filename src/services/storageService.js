import { BITACORAS_INICIALES, CATEGORIAS, EQUIPOS, USUARIOS_INICIALES } from '../data/initialData';

const STORAGE_KEYS = {
  BITACORAS: 'cba_wro_bitacoras_v2',
  USERS: 'cba_wro_users_v2',
  EQUIPOS: 'cba_wro_equipos_v2'
};

// Convierte tiempo 'mm:ss' o 'ss' a segundos numéricos para comparaciones
export const timeToSeconds = (timeStr) => {
  if (!timeStr) return 99999;
  const parts = timeStr.toString().trim().split(':');
  if (parts.length === 2) {
    const min = parseFloat(parts[0]) || 0;
    const sec = parseFloat(parts[1]) || 0;
    return min * 60 + sec;
  }
  return parseFloat(timeStr) || 99999;
};

// Inicialización de LocalStorage con datos por defecto limpios
export const initStorage = () => {
  // Limpiar versiones anteriores de datos de prueba
  if (localStorage.getItem('cba_wro_bitacoras_v1')) {
    localStorage.removeItem('cba_wro_bitacoras_v1');
  }
  if (localStorage.getItem('cba_wro_users_v1')) {
    localStorage.removeItem('cba_wro_users_v1');
  }

  if (!localStorage.getItem(STORAGE_KEYS.BITACORAS)) {
    localStorage.setItem(STORAGE_KEYS.BITACORAS, JSON.stringify(BITACORAS_INICIALES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(USUARIOS_INICIALES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EQUIPOS)) {
    localStorage.setItem(STORAGE_KEYS.EQUIPOS, JSON.stringify(EQUIPOS));
  }
};

// Guardar lista completa de equipos y notificar cambios
export const saveTeams = (teams) => {
  localStorage.setItem(STORAGE_KEYS.EQUIPOS, JSON.stringify(teams));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cba_teams_updated', { detail: { teams } }));
  }
  return teams;
};

// Obtener Equipos
export const getTeams = () => {
  initStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EQUIPOS);
    return data ? JSON.parse(data) : EQUIPOS;
  } catch {
    return EQUIPOS;
  }
};

// Obtener un equipo por ID
export const getTeamById = (teamId) => {
  const teams = getTeams();
  return teams.find(t => t.id === teamId) || null;
};

// Actualizar información o nombre de un equipo existente
export const updateTeam = (teamId, updatedData) => {
  const teams = getTeams();
  const index = teams.findIndex(t => t.id === teamId);
  if (index === -1) return null;

  const current = teams[index];
  const updated = {
    ...current,
    ...updatedData,
    // Asegurar que el id original no cambie para mantener intactas las relaciones
    id: current.id,
    nombre: (updatedData.nombre !== undefined ? updatedData.nombre.trim() : current.nombre)
  };

  teams[index] = updated;
  saveTeams(teams);
  return updated;
};

// Registrar un nuevo equipo (por registrar)
export const addTeam = ({ nombre, categoriaId = 'elementary', robotDefault = 'Robot-V1', color = null }) => {
  const teams = getTeams();
  const trimmedName = (nombre || '').trim();
  if (!trimmedName) {
    throw new Error('El nombre del equipo no puede estar vacío');
  }

  // Generar ID único amigable
  const baseSlug = trimmedName.toLowerCase().replace(/[^a-z0-9]/g, '');
  let id = baseSlug || `equipo_${Date.now()}`;
  let counter = 1;
  while (teams.some(t => t.id === id)) {
    id = `${baseSlug || 'equipo'}_${counter++}`;
  }

  const GRADIENT_PALETTES = [
    'from-blue-600 to-cyan-500',
    'from-amber-500 to-orange-600',
    'from-emerald-500 to-teal-600',
    'from-indigo-600 to-blue-500',
    'from-violet-600 to-purple-600',
    'from-rose-600 to-red-500',
    'from-fuchsia-600 to-pink-500',
    'from-teal-600 to-emerald-500',
    'from-sky-600 to-blue-700'
  ];
  const assignedColor = color || GRADIENT_PALETTES[teams.length % GRADIENT_PALETTES.length];

  const newTeam = {
    id,
    nombre: trimmedName,
    categoriaId,
    robotDefault: (robotDefault || '').trim() || 'Prototipo-1',
    color: assignedColor
  };

  const updatedTeams = [...teams, newTeam];
  saveTeams(updatedTeams);
  return newTeam;
};

// Eliminar un equipo (si no tiene bitácoras asociadas o según administración)
export const deleteTeam = (teamId) => {
  const teams = getTeams();
  const updatedTeams = teams.filter(t => t.id !== teamId);
  saveTeams(updatedTeams);
  return updatedTeams;
};

// Obtener Categorías
export const getCategories = () => CATEGORIAS;

// Obtener todas las bitácoras
export const getAllSessions = () => {
  initStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BITACORAS);
    return data ? JSON.parse(data) : BITACORAS_INICIALES;
  } catch {
    return BITACORAS_INICIALES;
  }
};

// Obtener bitácoras de un equipo específico
export const getSessionsByTeam = (teamId) => {
  const all = getAllSessions();
  return all.filter(s => s.equipoId === teamId);
};

// Guardar o actualizar una sesión de bitácora
export const saveSession = (sessionData) => {
  const all = getAllSessions();
  const existingIndex = all.findIndex(s => s.id === sessionData.id);
  
  let updated;
  if (existingIndex >= 0) {
    updated = [...all];
    updated[existingIndex] = sessionData;
  } else {
    const newSession = {
      ...sessionData,
      id: sessionData.id || `sesion_${Date.now()}`
    };
    updated = [newSession, ...all];
  }
  
  localStorage.setItem(STORAGE_KEYS.BITACORAS, JSON.stringify(updated));
  return updated;
};

// Eliminar una sesión
export const deleteSession = (sessionId) => {
  const all = getAllSessions();
  const updated = all.filter(s => s.id !== sessionId);
  localStorage.setItem(STORAGE_KEYS.BITACORAS, JSON.stringify(updated));
  return updated;
};

// Calcular el Mejor Resultado WRO (Mayor puntaje, menor tiempo como desempate)
export const calculateBestResult = (sessions, tipoFiltro = null) => {
  if (!sessions || sessions.length === 0) return null;
  
  const filteredSessions = tipoFiltro 
    ? sessions.filter(s => s.tipoEvento === tipoFiltro) 
    : sessions;
    
  let best = null;

  filteredSessions.forEach(session => {
    session.rondas?.forEach(ronda => {
      const puntaje = parseFloat(ronda.puntaje) || 0;
      const tiempoSeg = timeToSeconds(ronda.tiempo);

      if (!best) {
        best = {
          puntaje,
          tiempo: ronda.tiempo || '00:00',
          tiempoSeg,
          numeroRonda: ronda.numero,
          fecha: session.fecha,
          robot: session.nombreRobot,
          tipoEvento: session.tipoEvento,
          semana: session.semanaNumero,
          observaciones: ronda.observaciones
        };
      } else {
        const isHigherScore = puntaje > best.puntaje;
        const isTieWithFasterTime = puntaje === best.puntaje && tiempoSeg < best.tiempoSeg;

        if (isHigherScore || isTieWithFasterTime) {
          best = {
            puntaje,
            tiempo: ronda.tiempo,
            tiempoSeg,
            numeroRonda: ronda.numero,
            fecha: session.fecha,
            robot: session.nombreRobot,
            tipoEvento: session.tipoEvento,
            semana: session.semanaNumero,
            observaciones: ronda.observaciones
          };
        }
      }
    });
  });

  return best;
};

// Ranking por categoría (para el módulo de Representantes)
export const getRankingByCategory = (categoriaId) => {
  const teams = getTeams().filter(t => t.categoriaId === categoriaId);
  const allSessions = getAllSessions();

  const ranking = teams.map(team => {
    const teamSessions = allSessions.filter(s => s.equipoId === team.id);
    const bestGeneral = calculateBestResult(teamSessions);
    const bestPractica = calculateBestResult(teamSessions, 'practica');
    const bestRegional = calculateBestResult(teamSessions, 'regional');
    const totalRondas = teamSessions.reduce((acc, s) => acc + (s.rondas?.length || 0), 0);

    return {
      team,
      totalSesiones: teamSessions.length,
      totalRondas,
      bestGeneral,
      bestPractica,
      bestRegional,
      // Puntuación de ordenamiento: puntaje principal y tiempo en segundos
      sortScore: bestGeneral ? bestGeneral.puntaje : -1,
      sortTime: bestGeneral ? bestGeneral.tiempoSeg : 99999
    };
  });

  // Ordenar según reglas WRO: primero mayor puntaje, luego menor tiempo
  return ranking.sort((a, b) => {
    if (b.sortScore !== a.sortScore) {
      return b.sortScore - a.sortScore;
    }
    return a.sortTime - b.sortTime;
  });
};

// Usuarios
export const getUsers = () => {
  initStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    let users = data ? JSON.parse(data) : [...USUARIOS_INICIALES];

    // Garantizar que la cuenta administradora exista siempre
    const adminIndex = users.findIndex(
      u => u.rol === 'admin' || (u.email && u.email.toLowerCase() === 'admin@cbawro.edu')
    );

    if (adminIndex === -1) {
      users = [USUARIOS_INICIALES[0], ...users];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } else {
      let changed = false;
      if (!users[adminIndex].password) {
        users[adminIndex].password = 'admin';
        changed = true;
      }
      if (users[adminIndex].rol !== 'admin') {
        users[adminIndex].rol = 'admin';
        changed = true;
      }
      if (changed) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      }
    }

    return users;
  } catch {
    return USUARIOS_INICIALES;
  }
};

export const registerUser = (userData) => {
  const users = getUsers();
  const newUser = {
    ...userData,
    id: `user_${Date.now()}`
  };
  const updated = [...users, newUser];
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
  return newUser;
};

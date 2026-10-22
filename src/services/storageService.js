import { BITACORAS_INICIALES, CATEGORIAS, EQUIPOS, USUARIOS_INICIALES } from '../data/initialData';

const STORAGE_KEYS = {
  BITACORAS: 'cba_wro_bitacoras_v1',
  USERS: 'cba_wro_users_v1',
  EQUIPOS: 'cba_wro_equipos_v1'
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

// Inicialización de LocalStorage con datos por defecto
export const initStorage = () => {
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
    return data ? JSON.parse(data) : USUARIOS_INICIALES;
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

// Configuración oficial y equipos del CBA WRO Tracker
export const CATEGORIAS = [
  { id: 'elementary', nombre: 'Elementary', edad: '8 - 12 años' },
  { id: 'junior', nombre: 'Junior', edad: '13 - 15 años' }
];

export const EQUIPOS = [
  // Elementary
  { id: 'robotex', nombre: 'Robotex', categoriaId: 'elementary', robotDefault: 'Rex-V2', color: 'from-blue-600 to-cyan-500' },
  { id: 'pinbots', nombre: 'Pinbots', categoriaId: 'elementary', robotDefault: 'Pin-Striker', color: 'from-amber-500 to-orange-600' },
  { id: 'cyberminds', nombre: 'Cyberminds', categoriaId: 'elementary', robotDefault: 'MindBot-X', color: 'from-emerald-500 to-teal-600' },
  { id: 'bluemachine', nombre: 'Bluemachine', categoriaId: 'elementary', robotDefault: 'BlueRunner', color: 'from-indigo-600 to-blue-500' },
  { id: 'catatumbots', nombre: 'Catatumbots', categoriaId: 'elementary', robotDefault: 'Rayo-1', color: 'from-violet-600 to-purple-600' },
  
  // Junior
  { id: 'cyberbots', nombre: 'Cyberbots', categoriaId: 'junior', robotDefault: 'CyberTitan-Pro', color: 'from-rose-600 to-red-500' }
];

// Único usuario inicial: Profesor / Administrador del sistema
export const USUARIOS_INICIALES = [
  {
    id: 'user_admin',
    nombre: 'Profesor',
    apellido: 'Principal',
    email: 'admin@cbawro.edu',
    password: 'admin',
    rol: 'admin',
    equipoId: null
  }
];

// Bitácoras vacías para inicio limpio en producción
export const BITACORAS_INICIALES = [];

// Datos iniciales precargados para CBA WRO Tracker
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

export const USUARIOS_INICIALES = [
  {
    id: 'user_admin',
    nombre: 'Profesor',
    apellido: 'Principal',
    email: 'admin@cbawro.edu',
    password: 'admin',
    rol: 'admin',
    equipoId: null
  },
  {
    id: 'user_alumno_robotex',
    nombre: 'Carlos',
    apellido: 'Mendoza',
    email: 'carlos@robotex.edu',
    password: '123',
    rol: 'alumno',
    equipoId: 'robotex'
  },
  {
    id: 'user_repre_robotex',
    nombre: 'Elena',
    apellido: 'Guillén',
    email: 'elena@representantes.edu',
    password: '123',
    rol: 'representante',
    equipoId: 'robotex'
  }
];

// Bitácoras iniciales de prueba para tener estadísticas inmediatas
export const BITACORAS_INICIALES = [
  {
    id: 'sesion_1',
    equipoId: 'robotex',
    fecha: '2026-10-14',
    semanaNumero: 1,
    nombreRobot: 'Rex-V2',
    tipoEvento: 'practica', // 'practica' | 'regional'
    notasGenerales: 'Primera prueba completa con la mesa de competencia armada.',
    rondas: [
      { numero: 1, tiempo: '01:52', puntaje: 45, observaciones: 'Falla al detectar la línea negra en la curva 2. Giro brusco.' },
      { numero: 2, tiempo: '01:44', puntaje: 60, observaciones: 'Calibración de sensor de luz completada. Entrega objeto con éxito.' },
      { numero: 3, tiempo: '01:38', puntaje: 85, observaciones: 'Ajuste de velocidad en rectas (60%). Buena estabilidad.' },
      { numero: 4, tiempo: '01:31', puntaje: 90, observaciones: 'Solucionado rebote de cable en motor B. Ronda muy limpia.' },
      { numero: 5, tiempo: '01:25', puntaje: 100, observaciones: 'Todas las misiones completadas excepto la barrera final.' },
      { numero: 6, tiempo: '01:29', puntaje: 95, observaciones: 'Pequeño deslizamiento en rueda izquierda por polvo en llanta.' },
      { numero: 7, tiempo: '01:22', puntaje: 110, observaciones: 'Mejor tiempo del día en práctica. Se limpiaron neumáticos.' },
      { numero: 8, tiempo: '01:28', puntaje: 105, observaciones: 'Prueba de batería baja. Mantiene precisión en giros giroscópicos.' },
      { numero: 9, tiempo: '01:24', puntaje: 110, observaciones: 'Excelente consistencia en los primeros 3 cuadrantes.' },
      { numero: 10, tiempo: '01:20', puntaje: 115, observaciones: 'Ronda récord de práctica: 115 pts en 1m 20s.' }
    ]
  },
  {
    id: 'sesion_2',
    equipoId: 'robotex',
    fecha: '2026-10-21',
    semanaNumero: 2,
    nombreRobot: 'Rex-V2',
    tipoEvento: 'regional', // Simulación o competencia oficial regional
    notasGenerales: 'Ronda Oficial Regional WRO Venezuela - Etapa Clasificatoria',
    rondas: [
      { numero: 1, tiempo: '01:35', puntaje: 95, observaciones: 'Nervios en inicio. Alineación manual precisa.' },
      { numero: 2, tiempo: '01:28', puntaje: 105, observaciones: 'Misión de cubos perfecta. Jueces validan puntuación.' },
      { numero: 3, tiempo: '01:21', puntaje: 120, observaciones: '¡PUNTAJE PERFECTO WRO! 120 pts en 01:21 min.' },
      { numero: 4, tiempo: '01:26', puntaje: 110, observaciones: 'Se cayó un elemento al salir de zona de parqueo.' },
      { numero: 5, tiempo: '01:23', puntaje: 115, observaciones: 'Excelente maniobra en obstáculo sorpresa.' },
      { numero: 6, tiempo: '01:25', puntaje: 105, observaciones: 'Buena tracción en rampa.' },
      { numero: 7, tiempo: '01:22', puntaje: 115, observaciones: 'Alineación de sensores ultrasónicos óptima.' },
      { numero: 8, tiempo: '01:20', puntaje: 120, observaciones: 'Segundo puntaje perfecto: 120 pts en 01:20 min.' },
      { numero: 9, tiempo: '01:24', puntaje: 110, observaciones: 'Sin penalizaciones técnicas.' },
      { numero: 10, tiempo: '01:19', puntaje: 120, observaciones: 'RÉCORD ABSOLUTO REGIONAL: 120 pts en 01:19 min.' }
    ]
  },
  {
    id: 'sesion_3',
    equipoId: 'pinbots',
    fecha: '2026-10-18',
    semanaNumero: 1,
    nombreRobot: 'Pin-Striker',
    tipoEvento: 'practica',
    notasGenerales: 'Entrenamiento intensivo en agarre y liberación de piezas.',
    rondas: [
      { numero: 1, tiempo: '01:48', puntaje: 70, observaciones: 'Garra atascada al liberar segundo cubo.' },
      { numero: 2, tiempo: '01:40', puntaje: 85, observaciones: 'Se lubricaron engranajes de la pinza.' },
      { numero: 3, tiempo: '01:32', puntaje: 95, observaciones: 'Mejora en tiempo de ciclo de clasificación.' },
      { numero: 4, tiempo: '01:29', puntaje: 100, observaciones: 'Pasa barrera sin tocar bordes.' },
      { numero: 5, tiempo: '01:26', puntaje: 110, observaciones: 'Gran ejecución en zona de depósito.' },
      { numero: 6, tiempo: '01:30', puntaje: 90, observaciones: 'Pequeño deslizamiento en giro a 90°.' },
      { numero: 7, tiempo: '01:25', puntaje: 105, observaciones: 'Reajuste de constantes de PID.' },
      { numero: 8, tiempo: '01:23', puntaje: 110, observaciones: 'Ronda constante y estable.' },
      { numero: 9, tiempo: '01:21', puntaje: 112, observaciones: 'Mejor tiempo de Pinbots.' },
      { numero: 10, tiempo: '01:25', puntaje: 105, observaciones: 'Finaliza en zona de meta con luz verde.' }
    ]
  },
  {
    id: 'sesion_4',
    equipoId: 'cyberminds',
    fecha: '2026-10-19',
    semanaNumero: 1,
    nombreRobot: 'MindBot-X',
    tipoEvento: 'practica',
    notasGenerales: 'Pruebas de giroscopio y navegación autónoma.',
    rondas: [
      { numero: 1, tiempo: '01:50', puntaje: 65, observaciones: 'Desvío por deriva del giroscopio.' },
      { numero: 2, tiempo: '01:42', puntaje: 80, observaciones: 'Reset de ángulo cada 2 metros implementado.' },
      { numero: 3, tiempo: '01:35', puntaje: 90, observaciones: 'Navegación mucho más recta.' },
      { numero: 4, tiempo: '01:31', puntaje: 100, observaciones: 'Recoge 3 de 4 elementos.' },
      { numero: 5, tiempo: '01:27', puntaje: 105, observaciones: 'Buen desempeño en rampa.' },
      { numero: 6, tiempo: '01:28', puntaje: 100, observaciones: 'Tiempo estable.' },
      { numero: 7, tiempo: '01:25', puntaje: 108, observaciones: 'Aceleración controlada.' },
      { numero: 8, tiempo: '01:24', puntaje: 110, observaciones: 'Todas las misiones validadas.' },
      { numero: 9, tiempo: '01:22', puntaje: 112, observaciones: 'Mejor resultado Cyberminds.' },
      { numero: 10, tiempo: '01:26', puntaje: 105, observaciones: 'Fin de entrenamiento sin fallas de hardware.' }
    ]
  },
  {
    id: 'sesion_5',
    equipoId: 'bluemachine',
    fecha: '2026-10-17',
    semanaNumero: 1,
    nombreRobot: 'BlueRunner',
    tipoEvento: 'practica',
    notasGenerales: 'Rediseño de chasis para menor centro de gravedad.',
    rondas: [
      { numero: 1, tiempo: '01:45', puntaje: 75, observaciones: 'Chasis más estable en curvas rápidas.' },
      { numero: 2, tiempo: '01:38', puntaje: 85, observaciones: 'Buena respuesta de sensores de color.' },
      { numero: 3, tiempo: '01:30', puntaje: 95, observaciones: 'Menor vibración al transportar cargas.' },
      { numero: 4, tiempo: '01:28', puntaje: 100, observaciones: 'Ronda limpia sin salir de pista.' },
      { numero: 5, tiempo: '01:25', puntaje: 105, observaciones: 'Mejor control en frenado final.' },
      { numero: 6, tiempo: '01:27', puntaje: 95, observaciones: 'Falla menor en sujeción de cable.' },
      { numero: 7, tiempo: '01:24', puntaje: 105, observaciones: 'Cable fijado con precinto de seguridad.' },
      { numero: 8, tiempo: '01:22', puntaje: 108, observaciones: 'Muy buena velocidad.' },
      { numero: 9, tiempo: '01:20', puntaje: 110, observaciones: 'Mejor resultado BlueMachine.' },
      { numero: 10, tiempo: '01:23', puntaje: 105, observaciones: 'Cierre de sesión exitoso.' }
    ]
  },
  {
    id: 'sesion_6',
    equipoId: 'catatumbots',
    fecha: '2026-10-16',
    semanaNumero: 1,
    nombreRobot: 'Rayo-1',
    tipoEvento: 'practica',
    notasGenerales: 'Ajuste de relaciones de engranajes para velocidad.',
    rondas: [
      { numero: 1, tiempo: '01:40', puntaje: 70, observaciones: 'Demasiada velocidad en inicio provoca derrape.' },
      { numero: 2, tiempo: '01:35', puntaje: 80, observaciones: 'Rampa de aceleración por software aplicada.' },
      { numero: 3, tiempo: '01:29', puntaje: 90, observaciones: 'Curvas suaves y tracción continua.' },
      { numero: 4, tiempo: '01:26', puntaje: 95, observaciones: 'Alineación de sensores óptima.' },
      { numero: 5, tiempo: '01:23', puntaje: 102, observaciones: 'Pasa obstáculo con facilidad.' },
      { numero: 6, tiempo: '01:25', puntaje: 95, observaciones: 'Descarga de piezas a tiempo.' },
      { numero: 7, tiempo: '01:22', puntaje: 100, observaciones: 'Puntaje consistente.' },
      { numero: 8, tiempo: '01:20', puntaje: 105, observaciones: 'Gran ritmo de vuelta.' },
      { numero: 9, tiempo: '01:18', puntaje: 108, observaciones: 'Mejor tiempo de Catatumbots: 1m 18s.' },
      { numero: 10, tiempo: '01:21', puntaje: 102, observaciones: 'Buen rendimiento general.' }
    ]
  },
  {
    id: 'sesion_7',
    equipoId: 'cyberbots',
    fecha: '2026-10-20',
    semanaNumero: 1,
    nombreRobot: 'CyberTitan-Pro',
    tipoEvento: 'regional',
    notasGenerales: 'Competencia Regional Junior WRO - Reto de Automatización Avanzada',
    rondas: [
      { numero: 1, tiempo: '01:42', puntaje: 90, observaciones: 'Categoría Junior: Misión compleja de clasificación cromática.' },
      { numero: 2, tiempo: '01:34', puntaje: 105, observaciones: 'Brazo robótico de 3 ejes funciona con precisión milimétrica.' },
      { numero: 3, tiempo: '01:28', puntaje: 115, observaciones: 'Mapeo autónomo sin pérdida de odometría.' },
      { numero: 4, tiempo: '01:22', puntaje: 120, observaciones: '¡Puntaje perfecto en Junior! 120 pts en 01:22 min.' },
      { numero: 5, tiempo: '01:25', puntaje: 115, observaciones: 'Retorno seguro a zona de inicio.' },
      { numero: 6, tiempo: '01:24', puntaje: 115, observaciones: 'Buen ritmo en etapa de relevo.' },
      { numero: 7, tiempo: '01:21', puntaje: 120, observaciones: '120 pts en 01:21 min.' },
      { numero: 8, tiempo: '01:23', puntaje: 115, observaciones: 'Sin penalizaciones arbitrales.' },
      { numero: 9, tiempo: '01:19', puntaje: 120, observaciones: 'Tiempo récord: 120 pts en 01:19 min.' },
      { numero: 10, tiempo: '01:22', puntaje: 120, observaciones: 'Consistencia de alto nivel para el pase nacional.' }
    ]
  }
];

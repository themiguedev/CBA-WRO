# Sistema club de robotica CBA 🤖🇻🇪

Plataforma web moderna, minimalista y responsiva diseñada para el seguimiento técnico, control semanal de entrenamientos y evaluación de desempeño de los equipos de robótica del **Colegio Bellas Artes (Team Bellas Artes Bots)** con miras a los torneos y Regionales de la **WRO (World Robot Olympiad) Venezuela**.

El sistema digitaliza fielmente el formato oficial de la **Bitácora de Funcionalidad Técnica** de 10 rondas por equipo.

---

## 🔐 Cuenta de Administrador del Sistema

Para acceder con todos los privilegios de gestión técnica y supervisión docente:

| Campo | Valor |
| :--- | :--- |
| **Usuario / Correo:** | `admin@cbawro.edu` |
| **Contraseña:** | `admin` |
| **Rol:** | **Profesor / Administrador Principal** |
| **Acceso:** | Control total de edición de bitácoras de 10 rondas, puntuaciones (0–120 pts), cronometraje de tiempos (`mm:ss`), registro de fallas mecánicas/sensores y soluciones implementadas para todos los equipos. |

> [!TIP]
> En la pantalla de inicio de sesión existe un botón de **"Acceso Rápido Administrador"** que permite iniciar sesión automáticamente con esta cuenta sin necesidad de tipear las credenciales.

---

## 👥 Cuentas de Alumnos y Representantes

- **Registro de Alumnos:** Pueden registrarse desde la pestaña **"Registro Nuevo"** seleccionando su equipo asignado. Tienen acceso de consulta a su bitácora técnica, mejor resultado y soluciones de ingeniería.
- **Registro de Representantes:** Pueden registrarse seleccionando el equipo de su representado. Tienen acceso a la bitácora de su equipo más el **Leaderboard / Clasificación General** por categoría.

---

## 🚀 Equipos y Categorías Preconfigurados

### Categoría Elementary
- 🤖 **Robotex**
- 🤖 **Pinbots**
- 🤖 **Cyberminds**
- 🤖 **Bluemachine**
- 🤖 **Catatumbots**

### Categoría Junior
- 🚀 **Cyberbots**

---

## 📋 Características Principales

1. **Digitalización exacta de la Bitácora de Funcionalidad Técnica:**
   - Estructura de 10 rondas dividida en bloques (Rondas 1–5 y 6–10).
   - Control de tiempo exacto (`mm:ss`), puntaje oficial (0–120) y bitácora de ingeniería (falla presentada vs. solución técnica aplicada).
   - Selector de modalidad de evento: **Entrenamiento / Práctica** o **Regional WRO**.
   - Algoritmo de desempate oficial WRO: mayor puntaje primero; menor tiempo como criterio de desempate.

2. **Módulo de Clasificación y Rendimiento (Leaderboard):**
   - Tabla de posiciones en vivo filtrable por categoría (Elementary y Junior).
   - Detección automática del mejor intento histórico por equipo.

3. **Arquitectura con Roles Diferenciados:**
   - **Profesor / Administrador:** Carga, edición y guardado de bitácoras de todos los equipos.
   - **Alumno:** Visualización enfocada en el progreso técnico de su propio robot.
   - **Representante:** Seguimiento familiar y comparativa general de clasificación.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 19 + Vite
- **Estilos:** Tailwind CSS v4 (interfaz limpia, moderna y de alto contraste)
- **Iconos:** Lucide React
- **Persistencia:** LocalStorage reactivo desacoplado con datos iniciales precargados

---

## 📦 Ejecución y Puesta en Marcha

### Opción 1: Con scripts de Windows (Recomendado)
- **Iniciar el sistema:** Doble clic en `iniciar.bat` (o el acceso directo `INICIAR_SICEBA.bat.lnk` en el Escritorio). Se instalarán dependencias si es necesario y se abrirá el navegador automáticamente.
- **Detener el sistema:** Doble clic en `detener.bat` (o `DETENER_SICEBA.bat.lnk` en el Escritorio).

### Opción 2: Desde la terminal
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

---

## 📌 Ubicación de Archivos en el Escritorio
Se ha dejado una copia directa de esta documentación y las credenciales en tu escritorio:
- `D:\Usuarios\UCE.FCBA\Desktop\README.md`
- `D:\Usuarios\UCE.FCBA\Desktop\CREDENCIALES_ADMIN_SISTEMA.txt`

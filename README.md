# CBA WRO Tracker 🤖🇻🇪

Sistema web moderno, minimalista y responsivo para el seguimiento, control semanal y evaluación de desempeño de los equipos de robótica para entrenamientos y Regionales de la **WRO (World Robot Olympiad) Venezuela**.

Diseñado y estructurado fielmente a partir del formato oficial de la **Bitácora de Funcionalidad Técnica** de 10 rondas.

---

## 🚀 Características Principales

1. **Digitalización exacta de la Bitácora de Funcionalidad Técnica**:
   - Matriz de 10 rondas dividida en bloques (Rondas 1–5 y 6–10).
   - Control de **Tiempo** (`mm:ss`), **Puntaje** (0–120) y **Observaciones de Ingeniería** (registro de fallas mecánicas/sensores y soluciones implementadas).
   - Selector de modalidad de evento: **Entrenamiento / Práctica** o **Regional WRO**.
   - Algoritmo de cálculo automático del **Mejor Resultado** (regla WRO: mayor puntaje; menor tiempo como desempate).

2. **Categorías y Equipos Oficiales Preconfigurados**:
   - **Categoría Elementary**:
     - *Robotex*
     - *Pinbots*
     - *Cyberminds*
     - *Bluemachine*
     - *Catatumbots*
   - **Categoría Junior**:
     - *Cyberbots*

3. **Arquitectura de Roles**:
   - **Profesor / Administrador**: Edición y control total de tiempos, bitácoras y puntuaciones de todos los equipos.
   - **Alumnos**: Consulta exclusiva de su equipo asignado (Tarjeta destacada de Mejor Resultado histórico + Historial semanal con fallas y soluciones técnicas).
   - **Representantes**: Consulta de su equipo + **Módulo Exclusivo de Clasificación (Leaderboard)** por categoría para evaluar el rendimiento relativo y preparación competitiva.

4. **Autenticación y Registro Dinámico**:
   - Registro para Alumnos y Representantes con selección directa de su equipo desde un menú interactivo categorizado.
   - Selector rápido de demostración en barra superior para alternar entre roles al instante.

---

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 + Vite
- **Estilos**: Tailwind CSS v4 (modo oscuro minimalista de alto contraste)
- **Iconografía**: Lucide React
- **Persistencia**: LocalStorage reactivo desacoplado con datos iniciales precargados

---

## 📦 Instalación y Ejecución Local

### Opción 1: Con scripts de Windows (Recomendado)
* **Iniciar el servidor:** Haz doble clic en `iniciar.bat` (instalará dependencias automáticamente si es necesario y abrirá el navegador).
* **Detener el servidor:** Haz doble clic en `detener.bat` (cerrará los procesos activos de los puertos de Vite).

### Opción 2: Desde la terminal
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo local
npm run dev

# Compilar para producción
npm run build
```

---

## 👥 Acceso Inicial del Sistema

| Rol | Correo | Contraseña | Notas |
| :--- | :--- | :--- | :--- |
| **Profesor (Admin)** | `admin@cbawro.edu` | `admin` | Acceso global para cargar y gestionar las bitácoras de todos los equipos. |

*Nota: La plataforma inicia completamente limpia (0 bitácoras de prueba). Los alumnos y representantes pueden crearse su propia cuenta desde la pestaña **"Registro Nuevo"** seleccionando su equipo de robótica.*

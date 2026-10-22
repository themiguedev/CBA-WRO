import React, { useState } from 'react';
import {
  Award,
  Save,
  Calendar,
  Clock,
  Bot,
  Flag,
  Sparkles,
  LayoutGrid,
  Table as TableIcon,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Zap,
  HelpCircle
} from 'lucide-react';
import { timeToSeconds } from '../../services/storageService';

export const BitacoraTable = ({
  session,
  isEditable = false,
  onSave = null,
  teamName = ''
}) => {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [formData, setFormData] = useState(() => {
    const rondasCompletas = Array.from({ length: 10 }, (_, index) => {
      const num = index + 1;
      const found = session?.rondas?.find(r => r.numero === num);
      return found || { numero: num, tiempo: '', puntaje: '', observaciones: '' };
    });

    return {
      id: session?.id || null,
      equipoId: session?.equipoId || '',
      fecha: session?.fecha || new Date().toISOString().split('T')[0],
      semanaNumero: session?.semanaNumero || 1,
      nombreRobot: session?.nombreRobot || '',
      tipoEvento: session?.tipoEvento || 'practica',
      notasGenerales: session?.notasGenerales || '',
      rondas: rondasCompletas
    };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Determinar la mejor ronda de esta sesión
  const getBestRoundIndex = () => {
    let bestIdx = -1;
    let bestScore = -1;
    let bestTime = 99999;

    formData.rondas.forEach((r, idx) => {
      const p = parseFloat(r.puntaje);
      if (!isNaN(p) && p > 0) {
        const t = timeToSeconds(r.tiempo);
        if (p > bestScore || (p === bestScore && t < bestTime)) {
          bestScore = p;
          bestTime = t;
          bestIdx = idx;
        }
      }
    });

    return bestIdx;
  };

  const bestRoundIndex = getBestRoundIndex();

  // Estadísticas rápidas de la sesión
  const rondasConDatos = formData.rondas.filter(r => r.puntaje !== '' || r.tiempo !== '');
  const totalPuntos = formData.rondas.reduce((acc, r) => acc + (parseFloat(r.puntaje) || 0), 0);
  const promedioPuntos = rondasConDatos.length > 0 ? (totalPuntos / rondasConDatos.length).toFixed(1) : 0;
  const bestRound = bestRoundIndex >= 0 ? formData.rondas[bestRoundIndex] : null;

  const handleHeaderChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRondaChange = (index, field, value) => {
    setFormData(prev => {
      const newRondas = [...prev.rondas];
      newRondas[index] = {
        ...newRondas[index],
        [field]: value
      };
      return { ...prev, rondas: newRondas };
    });
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (onSave) {
      onSave(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    }
  };

  const getScoreColorClass = (score) => {
    const val = parseFloat(score);
    if (isNaN(val) || score === '') return 'text-slate-500';
    if (val >= 115) return 'text-emerald-400 font-black';
    if (val >= 90) return 'text-cyan-400 font-extrabold';
    if (val >= 60) return 'text-amber-400 font-bold';
    return 'text-rose-400 font-semibold';
  };

  // Renderizador de Bloque de Tabla (Rondas 1-5 o 6-10)
  const renderRoundsBlock = (startIdx, endIdx, title) => {
    const roundsSlice = formData.rondas.slice(startIdx, endIdx);

    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 overflow-hidden shadow-lg transition-all duration-300">
        <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">
              {title}
            </h4>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Formato WRO 10 Rondas</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-slate-900/40 text-slate-400 border-b border-slate-800/80 text-[11px] uppercase tracking-wider font-semibold">
                <th className="p-3 w-40 text-slate-400 border-r border-slate-800/80">
                  Parámetro
                </th>
                {roundsSlice.map((r, i) => {
                  const actualIdx = startIdx + i;
                  const isBest = actualIdx === bestRoundIndex;
                  return (
                    <th
                      key={r.numero}
                      className={`p-3 text-center border-r border-slate-800/80 last:border-r-0 transition-colors ${
                        isBest
                          ? 'bg-amber-500/15 text-amber-300 font-black'
                          : 'hover:bg-slate-900/50'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        {isBest && <Award className="w-4 h-4 text-amber-400 animate-bounce" />}
                        <span>RONDA {r.numero}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {/* Fila: TIEMPO */}
              <tr className="hover:bg-slate-900/40 transition-colors">
                <td className="p-3 font-bold uppercase tracking-wider text-slate-300 bg-slate-900/30 border-r border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <span>TIEMPO</span>
                  </div>
                </td>
                {roundsSlice.map((r, i) => {
                  const actualIdx = startIdx + i;
                  return (
                    <td key={r.numero} className="p-2.5 border-r border-slate-800/80 last:border-r-0 text-center">
                      {isEditable ? (
                        <input
                          type="text"
                          value={r.tiempo}
                          onChange={(e) => handleRondaChange(actualIdx, 'tiempo', e.target.value)}
                          placeholder="01:25"
                          className="w-full px-2 py-1.5 text-center text-xs font-mono font-bold rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all"
                        />
                      ) : (
                        <div className="font-mono text-xs font-bold text-slate-200">
                          {r.tiempo || <span className="text-slate-600">--:--</span>}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Fila: PUNTAJE */}
              <tr className="hover:bg-slate-900/40 transition-colors">
                <td className="p-3 font-bold uppercase tracking-wider text-slate-300 bg-slate-900/30 border-r border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span>PUNTAJE</span>
                  </div>
                </td>
                {roundsSlice.map((r, i) => {
                  const actualIdx = startIdx + i;
                  const isBest = actualIdx === bestRoundIndex;
                  return (
                    <td
                      key={r.numero}
                      className={`p-2.5 border-r border-slate-800/80 last:border-r-0 text-center transition-colors ${
                        isBest ? 'bg-amber-500/10' : ''
                      }`}
                    >
                      {isEditable ? (
                        <input
                          type="number"
                          min="0"
                          max="120"
                          value={r.puntaje}
                          onChange={(e) => handleRondaChange(actualIdx, 'puntaje', e.target.value)}
                          placeholder="0 - 120"
                          className="w-full px-2 py-1.5 text-center text-xs font-black rounded-lg bg-slate-900 border border-slate-700/80 text-amber-400 placeholder-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all"
                        />
                      ) : (
                        <div>
                          {r.puntaje !== '' && r.puntaje !== undefined ? (
                            <div className="flex flex-col items-center">
                              <span className={`text-sm ${getScoreColorClass(r.puntaje)}`}>
                                {r.puntaje} <span className="text-[10px] text-slate-500 font-normal">pts</span>
                              </span>
                              {/* Barra de progreso de la ronda */}
                              <div className="w-12 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    parseFloat(r.puntaje) >= 100
                                      ? 'bg-emerald-400'
                                      : parseFloat(r.puntaje) >= 70
                                      ? 'bg-blue-400'
                                      : 'bg-amber-400'
                                  }`}
                                  style={{ width: `${Math.min(100, (parseFloat(r.puntaje) / 120) * 100)}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-600 font-mono">-</span>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Fila: OBSERVACIONES */}
              <tr className="hover:bg-slate-900/40 transition-colors">
                <td className="p-3 font-bold uppercase tracking-wider text-slate-300 bg-slate-900/30 border-r border-slate-800/80 align-top">
                  <div className="font-semibold text-slate-200">OBSERVACIONES</div>
                  <div className="text-[10px] text-slate-400 font-normal mt-0.5 leading-snug">
                    Registro de Ingeniería, Fallas y Soluciones
                  </div>
                </td>
                {roundsSlice.map((r, i) => {
                  const actualIdx = startIdx + i;
                  return (
                    <td key={r.numero} className="p-2.5 border-r border-slate-800/80 last:border-r-0 align-top">
                      {isEditable ? (
                        <textarea
                          rows={3}
                          value={r.observaciones}
                          onChange={(e) => handleRondaChange(actualIdx, 'observaciones', e.target.value)}
                          placeholder="Fallas mecánicas, sensores o ajustes de software..."
                          className="w-full p-2 text-[11px] rounded-lg bg-slate-900 border border-slate-700/80 text-slate-200 placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all resize-none leading-relaxed"
                        />
                      ) : (
                        <div className="text-[11px] text-slate-300 italic min-h-[50px] p-1 leading-relaxed rounded-lg bg-slate-900/30 border border-slate-800/50">
                          {r.observaciones ? (
                            <span>{r.observaciones}</span>
                          ) : (
                            <span className="text-slate-600 font-normal not-italic">Sin notas registradas</span>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Vista en Tarjetas de Telemetría (Cards modernas e interactivas)
  const renderCardsView = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {formData.rondas.map((r, idx) => {
          const isBest = idx === bestRoundIndex;
          const score = parseFloat(r.puntaje) || 0;
          const pct = Math.min(100, (score / 120) * 100);

          return (
            <div
              key={r.numero}
              className={`rounded-2xl border p-4 transition-all duration-300 flex flex-col justify-between ${
                isBest
                  ? 'bg-gradient-to-b from-amber-500/10 via-slate-900 to-slate-950 border-amber-500/40 shadow-lg shadow-amber-500/10 transform -translate-y-1'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {/* Header de la tarjeta de ronda */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-6 w-6 rounded-lg bg-slate-800 flex items-center justify-center font-black text-xs text-white">
                      R{r.numero}
                    </span>
                    <span className="text-xs font-bold text-slate-300">Ronda {r.numero}</span>
                  </div>
                  {isBest && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/40">
                      <Award className="w-3 h-3" />
                      Récord
                    </span>
                  )}
                </div>

                {/* Puntaje y Tiempo */}
                <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 mb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Puntaje</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className={`text-xl font-black ${getScoreColorClass(r.puntaje)}`}>
                        {r.puntaje !== '' ? r.puntaje : '--'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">/120</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" /> Tiempo
                    </span>
                    <div className="font-mono text-sm font-bold text-white mt-1">
                      {r.tiempo || '--:--'}
                    </div>
                  </div>
                </div>

                {/* Barra de progreso de puntos */}
                <div className="mb-3">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Efectividad</span>
                    <span className="font-bold text-slate-300">{pct.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        pct >= 90 ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Observaciones de Ingeniería */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Fallas & Soluciones
                  </span>
                  <div className="text-[11px] text-slate-300 italic bg-slate-900/40 p-2 rounded-lg border border-slate-800/60 min-h-[46px] line-clamp-2">
                    {r.observaciones || <span className="text-slate-600 not-italic">Sin observaciones</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 animate-fadeIn">
      {/* Encabezado Fiel con Diseño Elevado */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-800/80 gap-5">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Flag className="w-5 h-5" />
              </div>
              <span>Bitácora de Funcionalidad técnica</span>
            </h2>

            <span
              className={`text-xs px-3 py-1 rounded-full font-black uppercase tracking-wider border shadow-sm ${
                formData.tipoEvento === 'regional'
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
              }`}
            >
              {formData.tipoEvento === 'regional' ? '🏆 Regional WRO Oficial' : '🛠️ Entrenamiento / Práctica'}
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-2">
            <span>Ficha oficial de 10 rondas con telemetría de tiempos, puntuación y registro de ingeniería.</span>
          </p>
        </div>

        {/* Toggle de Modo de Vista (Ficha vs Tarjetas) */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Ficha Oficial</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Tarjetas Telemetría</span>
          </button>
        </div>
      </div>

      {/* Métricas Resumen de la Sesión */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-blue-400" /> Promedio Sesión
          </span>
          <div className="text-lg font-black text-white mt-1">
            {promedioPuntos} <span className="text-xs text-slate-500 font-normal">pts</span>
          </div>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Award className="w-3 h-3 text-amber-400" /> Mejor Ronda
          </span>
          <div className="text-lg font-black text-amber-400 mt-1">
            {bestRound ? `${bestRound.puntaje} pts (#${bestRound.numero})` : '--'}
          </div>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" /> Mejor Tiempo
          </span>
          <div className="text-lg font-mono font-bold text-cyan-300 mt-1">
            {bestRound?.tiempo || '--:--'}
          </div>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400" /> Completitud
          </span>
          <div className="text-lg font-black text-emerald-400 mt-1">
            {rondasConDatos.length}/10 <span className="text-xs text-slate-500 font-normal">rondas</span>
          </div>
        </div>
      </div>

      {/* Campos de Encabezado Físico */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-500" /> Fecha
          </label>
          {isEditable ? (
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) => handleHeaderChange('fecha', e.target.value)}
              className="w-full mt-1 bg-transparent text-white font-bold focus:outline-none"
            />
          ) : (
            <div className="font-bold text-slate-200 mt-1">{formData.fecha}</div>
          )}
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400">Equipo</label>
          <div className="font-extrabold text-blue-400 truncate mt-1">
            {teamName || 'Equipo'}
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Bot className="w-3 h-3 text-slate-500" /> Robot Oficial
          </label>
          {isEditable ? (
            <input
              type="text"
              value={formData.nombreRobot}
              onChange={(e) => handleHeaderChange('nombreRobot', e.target.value)}
              placeholder="Ej: Rex-V2"
              className="w-full mt-1 bg-transparent text-white font-bold focus:outline-none"
            />
          ) : (
            <div className="font-bold text-slate-200 mt-1">{formData.nombreRobot || 'N/A'}</div>
          )}
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400">Modalidad</label>
          {isEditable ? (
            <select
              value={formData.tipoEvento}
              onChange={(e) => handleHeaderChange('tipoEvento', e.target.value)}
              className="w-full mt-1 bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="practica" className="bg-slate-900 text-white">Práctica</option>
              <option value="regional" className="bg-slate-900 text-white">Regional WRO</option>
            </select>
          ) : (
            <div className="font-bold text-slate-200 mt-1 capitalize">{formData.tipoEvento}</div>
          )}
        </div>
      </div>

      {/* Contenido según Modo Seleccionado */}
      {viewMode === 'table' ? (
        <div className="space-y-6">
          {renderRoundsBlock(0, 5, 'Primera Mitad: Rondas 1 al 5')}
          {renderRoundsBlock(5, 10, 'Segunda Mitad: Rondas 6 al 10')}
        </div>
      ) : (
        renderCardsView()
      )}

      {/* Botón de Guardar para Administrador */}
      {isEditable && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            {savedSuccess ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" />
                ¡Bitácora actualizada y sincronizada en el sistema!
              </span>
            ) : (
              <span>Los tiempos y puntuaciones se guardan inmediatamente en la base de datos local.</span>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios de la Bitácora
          </button>
        </div>
      )}
    </div>
  );
};

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
  CheckCircle2,
  Zap
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

  const getScoreBadgeClass = (score) => {
    const val = parseFloat(score);
    if (isNaN(val) || score === '') return 'text-slate-400 bg-slate-100 border-slate-200';
    if (val >= 115) return 'text-emerald-800 bg-emerald-100 border-emerald-300 font-black';
    if (val >= 90) return 'text-blue-800 bg-blue-100 border-blue-300 font-extrabold';
    if (val >= 60) return 'text-amber-800 bg-amber-100 border-amber-300 font-bold';
    return 'text-rose-800 bg-rose-100 border-rose-300 font-semibold';
  };

  // Renderizador de Bloque de Tabla (Rondas 1-5 o 6-10)
  const renderRoundsBlock = (startIdx, endIdx, title) => {
    const roundsSlice = formData.rondas.slice(startIdx, endIdx);

    return (
      <div className="rounded-2xl border border-slate-300 bg-white overflow-hidden shadow-sm transition-all duration-300">
        <div className="px-4 py-3 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
              {title}
            </h4>
          </div>
          <span className="text-[11px] text-slate-600 font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-slate-200">
            Formato Oficial WRO
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-slate-50 text-slate-800 border-b border-slate-300 text-xs uppercase tracking-wider font-extrabold">
                <th className="p-3 w-40 text-slate-800 border-r border-slate-300">
                  Parámetro
                </th>
                {roundsSlice.map((r, i) => {
                  const actualIdx = startIdx + i;
                  const isBest = actualIdx === bestRoundIndex;
                  return (
                    <th
                      key={r.numero}
                      className={`p-3 text-center border-r border-slate-300 last:border-r-0 transition-colors ${
                        isBest
                          ? 'bg-amber-100/90 text-amber-950 font-black'
                          : 'hover:bg-slate-100/60'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        {isBest && <Award className="w-4 h-4 text-amber-600 animate-bounce" />}
                        <span>RONDA {r.numero}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {/* Fila: TIEMPO */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3 font-extrabold uppercase tracking-wider text-slate-900 bg-slate-50/60 border-r border-slate-300">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span>TIEMPO</span>
                  </div>
                </td>
                {roundsSlice.map((r, i) => {
                  const actualIdx = startIdx + i;
                  return (
                    <td key={r.numero} className="p-2.5 border-r border-slate-200 last:border-r-0 text-center">
                      {isEditable ? (
                        <input
                          type="text"
                          value={r.tiempo}
                          onChange={(e) => handleRondaChange(actualIdx, 'tiempo', e.target.value)}
                          placeholder="01:25"
                          className="w-full px-2 py-1.5 text-center text-xs font-mono font-bold rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all shadow-sm"
                        />
                      ) : (
                        <div className="font-mono text-xs font-black text-slate-900 bg-slate-100/80 py-1 px-2 rounded border border-slate-200 inline-block min-w-[56px]">
                          {r.tiempo || <span className="text-slate-400 font-normal">--:--</span>}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Fila: PUNTAJE */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3 font-extrabold uppercase tracking-wider text-slate-900 bg-slate-50/60 border-r border-slate-300">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                      <Sparkles className="w-4 h-4" />
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
                      className={`p-2.5 border-r border-slate-200 last:border-r-0 text-center transition-colors ${
                        isBest ? 'bg-amber-50/80' : ''
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
                          className="w-full px-2 py-1.5 text-center text-xs font-black rounded-lg bg-white border border-slate-300 text-amber-700 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 focus:outline-none transition-all shadow-sm"
                        />
                      ) : (
                        <div>
                          {r.puntaje !== '' && r.puntaje !== undefined ? (
                            <div className="flex flex-col items-center">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full border text-xs font-black ${getScoreBadgeClass(r.puntaje)}`}>
                                {r.puntaje} pts
                              </span>
                              {/* Barra de progreso de la ronda */}
                              <div className="w-12 h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    parseFloat(r.puntaje) >= 100
                                      ? 'bg-emerald-500'
                                      : parseFloat(r.puntaje) >= 70
                                      ? 'bg-blue-500'
                                      : 'bg-amber-500'
                                  }`}
                                  style={{ width: `${Math.min(100, (parseFloat(r.puntaje) / 120) * 100)}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-mono font-bold">-</span>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Fila: OBSERVACIONES */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3 font-extrabold uppercase tracking-wider text-slate-900 bg-slate-50/60 border-r border-slate-300 align-top">
                  <div className="font-extrabold text-slate-900">OBSERVACIONES</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5 leading-snug">
                    Registro de Ingeniería, Fallas y Soluciones
                  </div>
                </td>
                {roundsSlice.map((r, i) => {
                  const actualIdx = startIdx + i;
                  return (
                    <td key={r.numero} className="p-2.5 border-r border-slate-200 last:border-r-0 align-top">
                      {isEditable ? (
                        <textarea
                          rows={3}
                          value={r.observaciones}
                          onChange={(e) => handleRondaChange(actualIdx, 'observaciones', e.target.value)}
                          placeholder="Fallas mecánicas, sensores o ajustes de software..."
                          className="w-full p-2 text-[11px] rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all resize-none leading-relaxed shadow-sm font-medium"
                        />
                      ) : (
                        <div className="text-[11px] text-slate-700 italic min-h-[50px] p-2 leading-relaxed rounded-lg bg-slate-50 border border-slate-200 font-medium">
                          {r.observaciones ? (
                            <span>{r.observaciones}</span>
                          ) : (
                            <span className="text-slate-400 font-normal not-italic">Sin notas registradas</span>
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

  // Vista en Tarjetas de Telemetría (Cards claras e interactivas)
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
              className={`rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                isBest
                  ? 'bg-gradient-to-b from-amber-50 via-white to-amber-50/30 border-amber-400 shadow-md transform -translate-y-1'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Header de la tarjeta de ronda */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-6 w-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-black text-xs">
                      R{r.numero}
                    </span>
                    <span className="text-xs font-extrabold text-slate-800">Ronda {r.numero}</span>
                  </div>
                  {isBest && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider border border-amber-300">
                      <Award className="w-3 h-3 text-amber-600" />
                      Récord
                    </span>
                  )}
                </div>

                {/* Puntaje y Tiempo */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Puntaje</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xl font-black text-slate-900">
                        {r.puntaje !== '' ? r.puntaje : '--'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">/120</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-600" /> Tiempo
                    </span>
                    <div className="font-mono text-sm font-bold text-slate-900 mt-1">
                      {r.tiempo || '--:--'}
                    </div>
                  </div>
                </div>

                {/* Barra de progreso de puntos */}
                <div className="mb-3">
                  <div className="flex justify-between text-[10px] text-slate-600 mb-1">
                    <span>Efectividad</span>
                    <span className="font-bold text-slate-900">{pct.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        pct >= 90 ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Observaciones de Ingeniería */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Fallas & Soluciones
                  </span>
                  <div className="text-[11px] text-slate-700 italic bg-slate-50 p-2 rounded-lg border border-slate-200 min-h-[46px] line-clamp-2">
                    {r.observaciones || <span className="text-slate-400 not-italic">Sin observaciones</span>}
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
    <div className="glass-card rounded-3xl p-5 sm:p-7 shadow-sm space-y-6 animate-fadeIn">
      {/* Encabezado Fiel con Diseño Luminoso */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-200 gap-5">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">
                <Flag className="w-5 h-5" />
              </div>
              <span>Bitácora de Funcionalidad técnica</span>
            </h2>

            <span
              className={`text-xs px-3.5 py-1 rounded-full font-black uppercase tracking-wider border shadow-sm ${
                formData.tipoEvento === 'regional'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-blue-100 text-blue-900 border-blue-300'
              }`}
            >
              {formData.tipoEvento === 'regional' ? '🏆 Regional WRO Oficial' : '🛠️ Entrenamiento / Práctica'}
            </span>
          </div>

          <p className="text-xs text-slate-600 mt-2 font-medium">
            Ficha oficial de 10 rondas con control de tiempos, puntuación y registro de ingeniería técnica.
          </p>
        </div>

        {/* Toggle de Modo de Vista (Ficha vs Tarjetas) */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 border border-slate-200 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-4 h-4" />
            <span>Ficha Oficial</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Tarjetas Telemetría</span>
          </button>
        </div>
      </div>

      {/* Métricas Resumen de la Sesión en tarjetas claras */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" /> Promedio Sesión
          </span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {promedioPuntos} <span className="text-xs text-slate-500 font-bold">pts</span>
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-600" /> Mejor Ronda
          </span>
          <div className="text-xl font-black text-amber-600 mt-1">
            {bestRound ? `${bestRound.puntaje} pts (#${bestRound.numero})` : '--'}
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-600" /> Mejor Tiempo
          </span>
          <div className="text-xl font-mono font-bold text-slate-900 mt-1">
            {bestRound?.tiempo || '--:--'}
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-emerald-600" /> Completitud
          </span>
          <div className="text-xl font-black text-emerald-700 mt-1">
            {rondasConDatos.length}/10 <span className="text-xs text-slate-500 font-bold">rondas</span>
          </div>
        </div>
      </div>

      {/* Campos de Encabezado Físico */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> Fecha
          </label>
          {isEditable ? (
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) => handleHeaderChange('fecha', e.target.value)}
              className="w-full mt-1 bg-white px-2 py-1 rounded border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-blue-600"
            />
          ) : (
            <div className="font-bold text-slate-900 mt-1">{formData.fecha}</div>
          )}
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-slate-500">Equipo</label>
          <div className="font-black text-blue-700 truncate mt-1 text-sm">
            {teamName || 'Equipo'}
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
            <Bot className="w-3.5 h-3.5 text-slate-400" /> Robot Oficial
          </label>
          {isEditable ? (
            <input
              type="text"
              value={formData.nombreRobot}
              onChange={(e) => handleHeaderChange('nombreRobot', e.target.value)}
              placeholder="Ej: Rex-V2"
              className="w-full mt-1 bg-white px-2 py-1 rounded border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-blue-600"
            />
          ) : (
            <div className="font-bold text-slate-900 mt-1">{formData.nombreRobot || 'N/A'}</div>
          )}
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-slate-500">Modalidad</label>
          {isEditable ? (
            <select
              value={formData.tipoEvento}
              onChange={(e) => handleHeaderChange('tipoEvento', e.target.value)}
              className="w-full mt-1 bg-white px-2 py-1 rounded border border-slate-300 text-slate-900 font-bold text-xs focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="practica">Práctica</option>
              <option value="regional">Regional WRO</option>
            </select>
          ) : (
            <div className="font-bold text-slate-900 mt-1 capitalize">{formData.tipoEvento}</div>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-slate-200">
          <div className="text-xs text-slate-600 font-medium">
            {savedSuccess ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ¡Bitácora actualizada y sincronizada en el sistema!
              </span>
            ) : (
              <span>Los tiempos y puntuaciones se guardan inmediatamente en la base de datos local.</span>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios de la Bitácora
          </button>
        </div>
      )}
    </div>
  );
};

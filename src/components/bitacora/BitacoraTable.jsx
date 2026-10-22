import React, { useState } from 'react';
import { Award, Save, Calendar, Clock, Bot, Flag, Sparkles } from 'lucide-react';
import { timeToSeconds } from '../../services/storageService';

export const BitacoraTable = ({
  session,
  isEditable = false,
  onSave = null,
  teamName = ''
}) => {
  // Manejo de estado local para edición interactiva por ronda
  const [formData, setFormData] = useState(() => {
    // Asegurar que existan exactamente 10 rondas
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

  // Calcular la mejor ronda de esta sesión específica
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
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  // Renderizar un bloque de 5 rondas (1-5 o 6-10) fiel a la ficha
  const renderRoundsBlock = (startIdx, endIdx) => {
    const roundsSlice = formData.rondas.slice(startIdx, endIdx);

    return (
      <div className="overflow-x-auto border border-slate-700/80 rounded-xl bg-slate-900/90 shadow-md">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-800/80 text-slate-200 border-b border-slate-700">
              <th className="p-3 text-xs font-bold uppercase tracking-wider text-slate-400 w-36 border-r border-slate-700">
                Parámetro
              </th>
              {roundsSlice.map((r, i) => {
                const actualIdx = startIdx + i;
                const isBest = actualIdx === bestRoundIndex;
                return (
                  <th
                    key={r.numero}
                    className={`p-3 text-xs font-bold text-center tracking-wider border-r border-slate-700 last:border-r-0 ${
                      isBest ? 'bg-amber-500/20 text-amber-300' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {isBest && <Award className="w-3.5 h-3.5 text-amber-400" />}
                      RONDA {r.numero}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {/* Fila: TIEMPO */}
            <tr className="border-b border-slate-800 hover:bg-slate-800/30 transition">
              <td className="p-3 text-xs font-bold uppercase tracking-wider text-slate-300 bg-slate-900/60 border-r border-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                TIEMPO
              </td>
              {roundsSlice.map((r, i) => {
                const actualIdx = startIdx + i;
                return (
                  <td key={r.numero} className="p-2 border-r border-slate-800 last:border-r-0 text-center">
                    {isEditable ? (
                      <input
                        type="text"
                        value={r.tiempo}
                        onChange={(e) => handleRondaChange(actualIdx, 'tiempo', e.target.value)}
                        placeholder="01:25"
                        className="w-full px-2 py-1.5 text-center text-xs font-mono font-medium rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none transition"
                      />
                    ) : (
                      <span className="font-mono text-xs font-semibold text-slate-200">
                        {r.tiempo || '--:--'}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Fila: PUNTAJE */}
            <tr className="border-b border-slate-800 hover:bg-slate-800/30 transition">
              <td className="p-3 text-xs font-bold uppercase tracking-wider text-slate-300 bg-slate-900/60 border-r border-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                PUNTAJE
              </td>
              {roundsSlice.map((r, i) => {
                const actualIdx = startIdx + i;
                const isBest = actualIdx === bestRoundIndex;
                return (
                  <td
                    key={r.numero}
                    className={`p-2 border-r border-slate-800 last:border-r-0 text-center ${
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
                        placeholder="pts"
                        className="w-full px-2 py-1.5 text-center text-xs font-bold rounded-lg bg-slate-950 border border-slate-700 text-amber-400 focus:border-amber-500 focus:outline-none transition"
                      />
                    ) : (
                      <span className="text-sm font-black text-amber-400">
                        {r.puntaje !== '' && r.puntaje !== undefined ? `${r.puntaje} pts` : '-'}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Fila: OBSERVACIONES */}
            <tr className="hover:bg-slate-800/30 transition">
              <td className="p-3 text-xs font-bold uppercase tracking-wider text-slate-300 bg-slate-900/60 border-r border-slate-700 align-top">
                <div className="font-semibold text-slate-200">OBSERVACIONES</div>
                <div className="text-[10px] text-slate-400 font-normal mt-0.5 leading-snug">
                  Registro de Ingeniería, Fallas y Soluciones
                </div>
              </td>
              {roundsSlice.map((r, i) => {
                const actualIdx = startIdx + i;
                return (
                  <td key={r.numero} className="p-2 border-r border-slate-800 last:border-r-0 align-top">
                    {isEditable ? (
                      <textarea
                        rows={3}
                        value={r.observaciones}
                        onChange={(e) => handleRondaChange(actualIdx, 'observaciones', e.target.value)}
                        placeholder="Fallas, ajustes de sensores, código o mecánica..."
                        className="w-full p-1.5 text-[11px] rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:border-blue-500 focus:outline-none transition resize-none leading-relaxed"
                      />
                    ) : (
                      <div className="text-[11px] text-slate-300 italic min-h-[50px] line-clamp-3 hover:line-clamp-none transition p-1">
                        {r.observaciones || <span className="text-slate-600">Sin notas</span>}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 shadow-xl">
      {/* Encabezado Fiel a la Bitácora Física */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 mb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Flag className="w-5 h-5 text-blue-400" />
              Bitácora de Funcionalidad técnica
            </h2>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                formData.tipoEvento === 'regional'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
              }`}
            >
              {formData.tipoEvento === 'regional' ? 'Regional WRO' : 'Entrenamiento / Práctica'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Registro estructurado de 10 rondas con control de tiempos, puntuación y bitácora de ingeniería.
          </p>
        </div>

        {/* Campos de Encabezado */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* FECHA */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-500" /> Fecha
            </label>
            {isEditable ? (
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => handleHeaderChange('fecha', e.target.value)}
                className="w-full mt-1 bg-transparent text-white font-semibold focus:outline-none"
              />
            ) : (
              <div className="font-semibold text-slate-200 mt-0.5">{formData.fecha}</div>
            )}
          </div>

          {/* EQUIPO */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <label className="text-[10px] uppercase font-bold text-slate-400">Equipo</label>
            <div className="font-bold text-blue-400 truncate mt-0.5">
              {teamName || 'Equipo'}
            </div>
          </div>

          {/* NOMBRE DEL ROBOT */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Bot className="w-3 h-3 text-slate-500" /> Nombre del Robot
            </label>
            {isEditable ? (
              <input
                type="text"
                value={formData.nombreRobot}
                onChange={(e) => handleHeaderChange('nombreRobot', e.target.value)}
                placeholder="Ej: Rex-V2"
                className="w-full mt-1 bg-transparent text-white font-semibold focus:outline-none"
              />
            ) : (
              <div className="font-semibold text-slate-200 mt-0.5">{formData.nombreRobot || 'N/A'}</div>
            )}
          </div>

          {/* TIPO DE EVENTO (Solo editable por admin) */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <label className="text-[10px] uppercase font-bold text-slate-400">Modalidad</label>
            {isEditable ? (
              <select
                value={formData.tipoEvento}
                onChange={(e) => handleHeaderChange('tipoEvento', e.target.value)}
                className="w-full mt-1 bg-slate-950 text-white font-semibold text-xs focus:outline-none"
              >
                <option value="practica">Práctica</option>
                <option value="regional">Regional WRO</option>
              </select>
            ) : (
              <div className="font-semibold text-slate-200 mt-0.5 capitalize">{formData.tipoEvento}</div>
            )}
          </div>
        </div>
      </div>

      {/* Espacio de Tablas: Bloque 1 (Rondas 1 a 5) */}
      <div className="space-y-6">
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Primera Mitad: Rondas 1 al 5</span>
            <span className="text-[11px] text-slate-500 font-normal">WRO Standard Runs</span>
          </div>
          {renderRoundsBlock(0, 5)}
        </div>

        {/* Espacio de Tablas: Bloque 2 (Rondas 6 a 10) */}
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Segunda Mitad: Rondas 6 al 10</span>
            <span className="text-[11px] text-slate-500 font-normal">Optimización y Pruebas Críticas</span>
          </div>
          {renderRoundsBlock(5, 10)}
        </div>
      </div>

      {/* Botón de Guardar para Administrador */}
      {isEditable && (
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            {savedSuccess ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                ✓ ¡Bitácora guardada y actualizada exitosamente!
              </span>
            ) : (
              <span>Haz clic en guardar para sincronizar los tiempos y puntajes en el sistema.</span>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios de la Bitácora
          </button>
        </div>
      )}
    </div>
  );
};

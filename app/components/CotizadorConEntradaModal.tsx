'use client';

import React, { useState } from 'react';

interface CotizadorConEntradaModalProps {
  avaluoActual: number;
  imagenSeleccionada: string;
  marcaModelo: string;
  onConfirm: (data: {
    monto: number;
    plazo: string;
    cuotaMensual: number;
    inscripcion: number;
    porcentajeEntrada: number;
    tasa: string;
  }) => void;
  onCancel: () => void;
  montosDisponibles: Array<{ MONTO: number; '24_MESES': number; '36_MESES': number; '48_MESES': number; '60_MESES': number; '72_MESES': number; INSCRIPCION: number }>;
  getTasaPorPlazo: (plazo: string) => string;
  calcularCuota: (monto: number, plazo: string, porcentaje: number) => { cuotaMensual: number; inscripcion: number } | null;
}

export function CotizadorConEntradaModal({
  avaluoActual,
  imagenSeleccionada,
  marcaModelo,
  onConfirm,
  onCancel,
  montosDisponibles,
  getTasaPorPlazo,
  calcularCuota,
}: CotizadorConEntradaModalProps) {
  const [porcentajeEntrada, setPorcentajeEntrada] = useState(20);
  const [montoSeleccionado, setMontoSeleccionado] = useState<number | ''>('');
  const [plazoSeleccionado, setplazoSeleccionado] = useState('24_MESES');
  const [resultadoPrecio, setResultadoPrecio] = useState<number | null>(null);
  const [resultadoInscripcion, setResultadoInscripcion] = useState<number | null>(null);

  const plazoOptions = ['24_MESES', '36_MESES', '48_MESES', '60_MESES', '72_MESES'];

  const handleMontoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const monto = e.target.value ? parseFloat(e.target.value) : '';
    setMontoSeleccionado(monto);
    actualizarResultado(monto, plazoSeleccionado);
  };

  const handleplazoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const plazo = e.target.value;
    setplazoSeleccionado(plazo);
    actualizarResultado(montoSeleccionado, plazo);
  };

  const actualizarResultado = (monto: number | '', plazo: string) => {
    if (typeof monto === 'number' && monto > 0) {
      const resultado = calcularCuota(monto, plazo, porcentajeEntrada);
      if (resultado) {
        setResultadoPrecio(resultado.cuotaMensual);
        setResultadoInscripcion(resultado.inscripcion);
      }
    } else {
      setResultadoPrecio(null);
      setResultadoInscripcion(null);
    }
  };

  const handleConfirm = () => {
    if (typeof montoSeleccionado !== 'number' || montoSeleccionado <= 0) {
      alert('Selecciona un monto válido');
      return;
    }
    if (!resultadoPrecio || !resultadoInscripcion) {
      alert('No se pudo calcular la cuota');
      return;
    }

    onConfirm({
      monto: montoSeleccionado,
      plazo: plazoSeleccionado,
      cuotaMensual: resultadoPrecio,
      inscripcion: resultadoInscripcion,
      porcentajeEntrada,
      tasa: getTasaPorPlazo(plazoSeleccionado),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#001E4E]">CON ENTRADA</h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Imagen del vehículo */}
          <div className="text-center">
            <img
              id="imagen-carro"
              src={imagenSeleccionada}
              alt="Vehículo seleccionado"
              className="h-48 mx-auto rounded-lg"
            />
            <p className="mt-4 text-lg font-bold text-slate-700">{marcaModelo}</p>
          </div>

          {/* Precio del vehículo */}
          <div>
            <label className="block text-sm font-bold text-[#001E4E] mb-2">
              Precio Referencia
            </label>
            <input
              type="text"
              id="precio-vehiculo-con-entrada"
              value={`AVALUO $${avaluoActual.toLocaleString()}`}
              disabled
              className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            />
          </div>

          {/* Porcentaje de entrada */}
          <div>
            <label className="block text-sm font-bold text-[#001E4E] mb-2">
              Porcentaje de Entrada (%)
            </label>
            <select
              id="porcentaje_auto"
              value={porcentajeEntrada}
              onChange={(e) => {
                const newPorcentaje = parseFloat(e.target.value);
                setPorcentajeEntrada(newPorcentaje);
                actualizarResultado(montoSeleccionado, plazoSeleccionado);
              }}
              className="w-full p-3 bg-slate-50 rounded-lg font-bold border border-gray-300"
            >
              {[10, 15, 20, 25, 30, 35, 40, 45, 50].map((p) => (
                <option key={p} value={p}>
                  {p}%
                </option>
              ))}
            </select>
          </div>

          {/* Monto a financiar */}
          <div>
            <label htmlFor="montoSelect" className="block text-sm font-bold text-[#001E4E] mb-2">
              Monto a Financiar
            </label>
            <select
              id="montoSelect"
              value={montoSeleccionado}
              onChange={handleMontoChange}
              className="w-full p-3 bg-slate-50 rounded-lg font-bold border border-gray-300"
            >
              <option value="">Selecciona un monto</option>
              {montosDisponibles.map((row) => (
                <option key={row.MONTO} value={row.MONTO}>
                  ${row.MONTO.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Plazo */}
          <div>
            <label htmlFor="mesesSelect" className="block text-sm font-bold text-[#001E4E] mb-2">
              Plazo (Meses)
            </label>
            <select
              id="mesesSelect"
              value={plazoSeleccionado}
              onChange={handleplazoChange}
              className="w-full p-3 bg-slate-50 rounded-lg font-bold border border-gray-300"
            >
              {plazoOptions.map((plazo) => (
                <option key={plazo} value={plazo}>
                  {plazo.replace('_MESES', '')} meses
                </option>
              ))}
            </select>
          </div>

          {/* Resultados */}
          {resultadoPrecio !== null && resultadoInscripcion !== null && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-700">Precio mensual:</span>
                <span id="resultadoPrecio" className="font-bold text-[#001E4E]">
                  ${resultadoPrecio.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-700">Inscripción:</span>
                <span id="resultadoInscripcion" className="font-bold text-[#001E4E]">
                  ${resultadoInscripcion.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-gray-200 text-slate-900 rounded-lg font-bold hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-3 bg-[#001E4E] text-white rounded-lg font-bold hover:bg-blue-900 transition"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

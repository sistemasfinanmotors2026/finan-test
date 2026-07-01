'use client';

import React, { useState } from 'react';

interface CotizadorSinEntradaModalProps {
  avaluoActual: number;
  imagenSeleccionada: string;
  marcaModelo: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CotizadorSinEntradaModal({
  avaluoActual,
  imagenSeleccionada,
  marcaModelo,
  onConfirm,
  onCancel,
}: CotizadorSinEntradaModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#001E4E]">SIN ENTRADA</h2>
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
              id="imagen-carroSN"
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
              id="precio-vehiculo-popSN"
              value={`Precio Referencia $${avaluoActual.toLocaleString()}`}
              disabled
              className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
            />
          </div>

          {/* Info mensaje */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-slate-700">
              Con opción sin entrada, financiarás el 100% del valor del vehículo. Continúa para ver más detalles.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-gray-200 text-slate-900 rounded-lg font-bold hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
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

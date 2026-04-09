import React from 'react';
import { formatCurrency } from '../../lib/utils';
import type { QuotePlan } from '../../lib/types';
import type { TipoFinanciamiento } from '../../types/cotizador-finance';
import { MESES_ENTREGA_OPCIONES } from '../../hooks/useCotizadorCalculations';

type OpcionJustoATiempo = {
  plazo: number;
  porcentaje: number;
  montoPagar: number;
};

type FinancingSectionProps = {
  plan: QuotePlan;
  tipoFinanciamiento: TipoFinanciamiento;
  plazo: number;
  porcentajeEntrada: number;
  mesEntrega: number;
  isPlanAutoSeguro: boolean;
  isPlanJustoATiempo: boolean;
  montoEntrada: number;
  ofertaMesSeis: number;
  opcionesJustoATiempo: OpcionJustoATiempo[];
  onPlanChange: (plan: QuotePlan) => void;
  onTipoFinanciamientoChange: (tipo: TipoFinanciamiento) => void;
  onPlazoChange: (plazo: number) => void;
  onPorcentajeEntradaChange: (porcentaje: number) => void;
  onMesEntregaChange: (mes: number) => void;
};

export function FinancingSection({
  plan,
  tipoFinanciamiento,
  plazo,
  porcentajeEntrada,
  mesEntrega,
  isPlanAutoSeguro,
  isPlanJustoATiempo,
  montoEntrada,
  ofertaMesSeis,
  opcionesJustoATiempo,
  onPlanChange,
  onTipoFinanciamientoChange,
  onPlazoChange,
  onPorcentajeEntradaChange,
  onMesEntregaChange,
}: FinancingSectionProps) {
  return (
    <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
      <p className="text-xs font-black tracking-widest text-[#001E4E]">FINANCIAMIENTO</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select
          className="w-full p-3 bg-white rounded-xl font-bold outline-none"
          value={plan}
          onChange={(e) => onPlanChange(e.target.value as QuotePlan)}
        >
          <option value="PLAN_ADELANTADO">Con entrada - Plan Adelantado</option>
          <option value="PLAN_PUNTUACION">Sin entrada - Plan Puntuacion</option>
          <option value="PLAN_JUSTO_A_TIEMPO">Plan Justo a Tiempo</option>
          <option value="PLAN_AUTO_SEGURO">Plan Auto Seguro</option>
        </select>

        <select
          className="w-full p-3 bg-white rounded-xl font-bold outline-none"
          value={tipoFinanciamiento}
          onChange={(e) => onTipoFinanciamientoChange(e.target.value as TipoFinanciamiento)}
          disabled={isPlanAutoSeguro}
        >
          <option value="CON_ENTRADA">Con entrada</option>
          <option value="SIN_ENTRADA">Sin entrada</option>
        </select>

        <select
          className="w-full p-3 bg-white rounded-xl font-bold outline-none"
          value={plazo}
          onChange={(e) => onPlazoChange(Number(e.target.value))}
          disabled={isPlanAutoSeguro}
        >
          {[24, 36, 48, 60, 72, 84].map((m) => (
            <option key={m} value={m}>{m} meses</option>
          ))}
        </select>
      </div>

      {tipoFinanciamiento === 'CON_ENTRADA' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select
            className="w-full p-3 bg-white rounded-xl font-bold outline-none"
            value={porcentajeEntrada}
            onChange={(e) => onPorcentajeEntradaChange(Number(e.target.value))}
            disabled={isPlanAutoSeguro || isPlanJustoATiempo}
          >
            {[10, 15, 20, 25, 30, 35, 40, 50].map((p) => (
              <option key={p} value={p}>{p}% entrada</option>
            ))}
          </select>
          <div className="p-3 bg-white rounded-xl font-bold text-[#001E4E]">
            Entrada: {formatCurrency(montoEntrada)}
          </div>
        </div>
      )}

      {isPlanJustoATiempo && (
        <div className="space-y-3">
          <select
            className="w-full p-3 bg-white rounded-xl font-bold outline-none"
            value={mesEntrega}
            onChange={(e) => onMesEntregaChange(Number(e.target.value))}
          >
            {MESES_ENTREGA_OPCIONES.map((mes) => (
              <option key={mes} value={mes}>Entrega en mes {mes}</option>
            ))}
          </select>
          <div className="rounded-xl bg-white p-3 text-sm text-[#001E4E]">
            <p className="font-bold mb-1">Opciones de pago para Justo a Tiempo:</p>
            {opcionesJustoATiempo.length > 0 ? (
              opcionesJustoATiempo.map((op) => (
                <p key={`${op.plazo}-${op.porcentaje}`}>
                  {op.plazo} meses - {op.porcentaje}% ({formatCurrency(op.montoPagar)})
                </p>
              ))
            ) : (
              <p>No hay opciones disponibles para este mes de entrega.</p>
            )}
          </div>
        </div>
      )}

      {isPlanAutoSeguro && (
        <div className="rounded-xl bg-white p-3 text-sm text-[#001E4E]">
          <p className="font-bold">Plan Auto Seguro: cuota fija a 6 meses</p>
          <p>Oferta mes 6: {formatCurrency(ofertaMesSeis)}</p>
        </div>
      )}
    </div>
  );
}

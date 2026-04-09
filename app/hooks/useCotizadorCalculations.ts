import type { QuotePlan } from '../lib/types';
import type { CotizacionTipo } from '../types/cotizador';
import type { AutoSeguroMetaRow, TipoFinanciamiento, VehicularMetaRow } from '../types/cotizador-finance';

const JUSTO_TIEMPO_MATRIX: Record<number, Record<number, number>> = {
  24: { 30: 7, 35: 6, 40: 5, 45: 4, 50: 3 },
  36: { 30: 11, 35: 9, 40: 8, 45: 6, 50: 5 },
  48: { 30: 14, 35: 12, 40: 10, 45: 8, 50: 6 },
  60: { 30: 18, 35: 15, 40: 13, 45: 10, 50: 8 },
  72: { 30: 21, 35: 18, 40: 15, 45: 12, 50: 9 },
};

export const MESES_ENTREGA_OPCIONES = Array.from(
  new Set(Object.values(JUSTO_TIEMPO_MATRIX).flatMap((v) => Object.values(v)))
).sort((a, b) => a - b);

type CotizadorCalculationInput = {
  seccion: CotizacionTipo;
  form: {
    plan: QuotePlan;
    precio: number;
    plazo: number;
    porcentajeEntrada: number;
    tipoFinanciamiento: TipoFinanciamiento;
    mesEntrega: number;
  };
  vehicularMeta: VehicularMetaRow[];
  inmobiliarioMeta: VehicularMetaRow[];
  autoSeguroMeta: AutoSeguroMetaRow[];
};

const findClosestByMonto = <T extends { MONTO: number }>(rows: T[], monto: number) => {
  if (!rows.length || !monto) return null;

  return rows.reduce((closest, current) => {
    const currentDiff = Math.abs(current.MONTO - monto);
    const closestDiff = Math.abs(closest.MONTO - monto);
    return currentDiff < closestDiff ? current : closest;
  });
};

export const useCotizadorCalculations = ({
  seccion,
  form,
  vehicularMeta,
  inmobiliarioMeta,
  autoSeguroMeta,
}: CotizadorCalculationInput) => {
  const isVehicular = seccion === 'VEHICULAR';
  const isPlanJustoATiempo = form.plan === 'PLAN_JUSTO_A_TIEMPO';
  const isPlanAutoSeguro = form.plan === 'PLAN_AUTO_SEGURO';

  const montoFinanciado = isVehicular && form.tipoFinanciamiento === 'CON_ENTRADA'
    ? form.precio * (1 - form.porcentajeEntrada / 100)
    : form.precio;

  const financingMeta = isVehicular ? vehicularMeta : inmobiliarioMeta;
  const financingRow = findClosestByMonto(financingMeta, form.precio);
  const autoSeguroRow = isVehicular ? findClosestByMonto(autoSeguroMeta, form.precio) : null;
  const plazoKey = `${form.plazo}_MESES`;
  const cuotaMeta = financingRow ? Number(financingRow[plazoKey] ?? 0) : 0;

  const cuotaMensualBase = cuotaMeta > 0
    ? cuotaMeta
    : (montoFinanciado > 0 ? montoFinanciado / form.plazo : 0);

  const cuotaMensual = isPlanAutoSeguro
    ? Number(autoSeguroRow?.CUOTA ?? 0) || (form.precio * 0.65) / 6
    : cuotaMensualBase;

  const inscripcion = isPlanAutoSeguro
    ? Number(autoSeguroRow?.INSCRIPCION ?? 0) || Number(financingRow?.INSCRIPCION ?? 0) || form.precio * 0.04
    : Number(financingRow?.INSCRIPCION ?? 0) || form.precio * 0.04;

  const ofertaMesSeis = isPlanAutoSeguro
    ? Number(autoSeguroRow?.OFERTA ?? 0) || form.precio * 0.35
    : 0;

  const montoEntrada = form.tipoFinanciamiento === 'CON_ENTRADA'
    ? Math.max(form.precio - (form.precio * (form.porcentajeEntrada / 100)), 0)
    : 0;

  const opcionesJustoATiempo = Object.entries(JUSTO_TIEMPO_MATRIX)
    .flatMap(([plazoMeses, porcentajes]) =>
      Object.entries(porcentajes)
        .filter(([, mesEntrega]) => mesEntrega === form.mesEntrega)
        .map(([porcentaje]) => ({
          plazo: Number(plazoMeses),
          porcentaje: Number(porcentaje),
          montoPagar: form.precio * (Number(porcentaje) / 100),
        }))
    );

  return {
    isVehicular,
    isPlanJustoATiempo,
    isPlanAutoSeguro,
    montoFinanciado,
    cuotaMensual,
    inscripcion,
    ofertaMesSeis,
    montoEntrada,
    opcionesJustoATiempo,
  };
};

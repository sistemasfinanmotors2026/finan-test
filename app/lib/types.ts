// lib/types.ts
export type QuotePlan =
  | 'PLAN_ADELANTADO'
  | 'PLAN_PUNTUACION'
  | 'PLAN_JUSTO_A_TIEMPO'
  | 'PLAN_AUTO_SEGURO';

export interface QuoteData {
  nombre: string;
  correo: string;
  telefono: string;
  tipoProducto?: 'VEHICULAR' | 'INMOBILIARIA';
  marca: string;
  modelo: string;
  precio: number;
  meses: number;
  cuota: number;
  inscripcion: number;
  cedula?: string;
  provincia?: string;
  ciudad?: string;
  agencia?: string;
  tipoCliente?: string;
  tipoFinanciamiento?: 'CON_ENTRADA' | 'SIN_ENTRADA';
  porcentajeEntrada?: number;
  montoEntrada?: number;
  plan?: QuotePlan;
  mesEntrega?: number;
  ofertaMesSeis?: number;
}
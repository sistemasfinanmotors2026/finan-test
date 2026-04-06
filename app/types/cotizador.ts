export type CotizacionTipo = 'VEHICULAR' | 'INMOBILIARIA' | null;

export interface Categoria {
  id: string;
  nombre: string;
  imagen: string;
}
// types/cotizador.ts (Añade esto a tus tipos)
export interface ModeloVehiculo {
  marca: string;
  nombre: string;
  precio: number;
  tipo: string; // 'autos', 'suvs', etc.
  imagen: string;
}

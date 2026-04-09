export type TipoFinanciamiento = 'CON_ENTRADA' | 'SIN_ENTRADA';

export type VehicularMetaRow = {
  MONTO: number;
  INSCRIPCION: number;
  [key: string]: string | number | null;
};

export type AutoSeguroMetaRow = {
  MONTO: number;
  CUOTA: number;
  OFERTA: number;
  INSCRIPCION?: number;
};

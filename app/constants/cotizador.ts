import { Categoria } from "../types/cotizador";

export const CATEGORIAS_VEHICULAR: Categoria[] = [
  { id: 'autos', nombre: 'Autos', imagen: '/auto_base.png' },
  { id: 'suvs', nombre: 'SUVs', imagen: '/suv_base.png' },
  { id: 'camionetas', nombre: 'Camionetas', imagen: '/camioneta_base.png' },
  { id: 'camiones', nombre: 'Camiones', imagen: '/camion_base.png' },
];

export const CATEGORIAS_INMOBILIARIA: Categoria[] = [
  { id: 'terreno', nombre: 'Terreno', imagen: '/terreno.jpg' }, // Ajusta las URLs
  { id: 'departamento', nombre: 'Departamento', imagen: '/casa.jpg' },
  { id: 'finca', nombre: 'Finca', imagen: '/FincaFinan.jpeg' },
  { id: 'construccion', nombre: 'Construcción', imagen: '/construccion.jpg' },
];
import { useEffect, useState } from 'react';
import type { ModeloVehiculo } from '../types/cotizador';
import type { AutoSeguroMetaRow, VehicularMetaRow } from '../types/cotizador-finance';

type ModeloJSON = Omit<ModeloVehiculo, 'marca'>;

export const useCotizadorData = () => {
  const [allModelos, setAllModelos] = useState<ModeloVehiculo[]>([]);
  const [vehicularMeta, setVehicularMeta] = useState<VehicularMetaRow[]>([]);
  const [inmobiliarioMeta, setInmobiliarioMeta] = useState<VehicularMetaRow[]>([]);
  const [autoSeguroMeta, setAutoSeguroMeta] = useState<AutoSeguroMetaRow[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        let res = await fetch('/modelo.json');
        if (!res.ok) {
          res = await fetch('/metadata/modelo.json');
        }
        if (!res.ok) {
          throw new Error('No se pudo cargar modelo.json');
        }

        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          throw new Error('La respuesta de modelo.json no es JSON valido');
        }

        const data = await res.json();
        const listaPlana: ModeloVehiculo[] = Object.entries(data).flatMap(([marca, modelos]) => {
          return (modelos as ModeloJSON[]).map((m) => ({
            ...m,
            marca: marca.toUpperCase(),
          }));
        });
        setAllModelos(listaPlana);
      } catch (error) {
        console.error('Error cargando modelos:', error);
      }
    };

    cargarDatos();
  }, []);

  useEffect(() => {
    const cargarMetadata = async () => {
      try {
        const [vehicularRes, inmobiliarioRes, autoSeguroRes] = await Promise.all([
          fetch('/metadata/vehicular_M2.json'),
          fetch('/metadata/inmobiliario_M2.json'),
          fetch('/metadata/6meses.json'),
        ]);

        if (vehicularRes.ok) {
          const vehicularData = await vehicularRes.json() as VehicularMetaRow[];
          setVehicularMeta(vehicularData);
        }

        if (inmobiliarioRes.ok) {
          const inmobiliarioData = await inmobiliarioRes.json() as VehicularMetaRow[];
          setInmobiliarioMeta(inmobiliarioData);
        }

        if (autoSeguroRes.ok) {
          const autoSeguroData = await autoSeguroRes.json() as AutoSeguroMetaRow[];
          setAutoSeguroMeta(autoSeguroData);
        }
      } catch (error) {
        console.error('Error cargando metadata:', error);
      }
    };

    cargarMetadata();
  }, []);

  return {
    allModelos,
    vehicularMeta,
    inmobiliarioMeta,
    autoSeguroMeta,
  };
};

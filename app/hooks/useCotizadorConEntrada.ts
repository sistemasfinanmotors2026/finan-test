'use client';

import { useEffect, useState } from 'react';

export interface VehicularMontoRow {
  COD: string;
  MONTO: number;
  '24_MESES': number;
  '36_MESES': number;
  '48_MESES': number;
  '60_MESES': number;
  '72_MESES': number;
  INSCRIPCION: number;
}

type PlazoKey = '24_MESES' | '36_MESES' | '48_MESES' | '60_MESES' | '72_MESES';

export const useCotizadorConEntrada = () => {
  const [montosDisponibles, setMontosDisponibles] = useState<VehicularMontoRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarMontos = async () => {
      try {
        const res = await fetch('/metadata/vehicular_M2.json');
        if (!res.ok) throw new Error('No se pudo cargar montos');
        const data = await res.json();
        setMontosDisponibles(data);
      } catch (error) {
        console.error('Error cargando montos:', error);
        setMontosDisponibles([]);
      } finally {
        setLoading(false);
      }
    };

    cargarMontos();
  }, []);

  const findClosestMonto = (montoTarget: number): VehicularMontoRow | null => {
    if (!montosDisponibles.length) return null;
    return montosDisponibles.reduce((closest, current) => {
      const currentDiff = Math.abs(current.MONTO - montoTarget);
      const closestDiff = Math.abs(closest.MONTO - montoTarget);
      return currentDiff < closestDiff ? current : closest;
    });
  };

  const calcularCuota = (
    monto: number,
    plazo: string,
    porcentajeEntrada: number
  ): { cuotaMensual: number; inscripcion: number } | null => {
    const row = findClosestMonto(monto);
    if (!row) return null;

    const plazoKey = plazo as PlazoKey;
    const montoFinanciado = monto * (1 - porcentajeEntrada / 100);
    const cuotaMensual = row[plazoKey] || (montoFinanciado / parseInt(plazo)) || 0;
    const inscripcion = row.INSCRIPCION || 0;

    return {
      cuotaMensual: Math.round(cuotaMensual * 100) / 100,
      inscripcion: Math.round(inscripcion * 100) / 100,
    };
  };

  // Obtener tasas por plazo (como en el respaldo HTML)
  const getTasaPorPlazo = (plazo: string): string => {
    const tasas: Record<string, string> = {
      '24_MESES': '5.5%',
      '36_MESES': '5.84%',
      '48_MESES': '4.38%',
      '60_MESES': '3.5%',
      '72_MESES': '2.92%',
    };
    return tasas[plazo] || '2.92%';
  };

  return {
    montosDisponibles,
    loading,
    findClosestMonto,
    calcularCuota,
    getTasaPorPlazo,
  };
};

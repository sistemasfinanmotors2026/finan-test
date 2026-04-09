'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Cotizador from '../components/Cotizador';

export default function CotizadorRoute() {
  const searchParams = useSearchParams();
  const cotizadorKey = useMemo(() => {
    return searchParams.get('fresh') ?? 'default';
  }, [searchParams]);

  return <Cotizador key={cotizadorKey} />;
}

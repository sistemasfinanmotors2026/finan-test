'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CATEGORIAS_VEHICULAR, CATEGORIAS_INMOBILIARIA } from '../constants/cotizador';
import { formatCurrency } from '../lib/utils';
import type { QuoteData, QuotePlan } from '../lib/types';
import type { CotizacionTipo, ModeloVehiculo } from '../types/cotizador';
import { useCotizadorData } from '../hooks/useCotizadorData';
import { useCotizadorCalculations } from '../hooks/useCotizadorCalculations';
import type { TipoFinanciamiento } from '../types/cotizador-finance';
import { FinancingSection } from './cotizador/FinancingSection';
import { ClientDataSection } from './cotizador/ClientDataSection';

interface CotizadorForm {
  marca: string;
  modelo: string;
  precio: number;
  plazo: number;
  porcentajeEntrada: number;
  tipoFinanciamiento: TipoFinanciamiento;
  plan: QuotePlan;
  mesEntrega: number;
  nombre: string;
  correo: string;
  telefono: string;
  cedula: string;
  provincia: string;
  agencia: string;
  ciudad: string;
  tipoCliente: string;
  aceptaTerminos: boolean;
  imagen: string;
}

const AGENCIAS_POR_PROVINCIA: Record<string, string[]> = {
  Pichincha: ['Quito Norte', 'Quito Sur', 'Valle de los Chillos'],
  Guayas: ['Guayaquil Centro', 'Samborondon', 'Daule'],
  Manabi: ['Manta', 'Portoviejo', 'Chone'],
  Azuay: ['Cuenca Centro', 'Cuenca Norte']
};

const INITIAL_FORM: CotizadorForm = {
  marca: '',
  modelo: '',
  precio: 0,
  plazo: 72,
  porcentajeEntrada: 20,
  tipoFinanciamiento: 'CON_ENTRADA',
  plan: 'PLAN_ADELANTADO',
  mesEntrega: 7,
  nombre: '',
  correo: '',
  telefono: '',
  cedula: '',
  provincia: '',
  agencia: '',
  ciudad: '',
  tipoCliente: 'PRIMERA_VEZ',
  aceptaTerminos: false,
  imagen: ''
};

const normalizarCategoria = (categoria: string) => categoria.toLowerCase().replace(/s$/, '');

const coincideTipoCategoria = (tipo: string, categoria: string | null) => {
  if (!categoria) return false;

  const catNormalizada = normalizarCategoria(categoria);
  const tipoModelo = tipo.toLowerCase();

  if (catNormalizada === 'auto') {
    return tipoModelo === 'hatchback' || tipoModelo === 'sedan' || tipoModelo === 'auto';
  }

  return tipoModelo === catNormalizada;
};

export default function Cotizador() {
  const [step, setStep] = useState(1);
  const [seccion, setSeccion] = useState<CotizacionTipo>(null);
  const [categoriaId, setCategoriaId] = useState<string | null>(null);

  const { allModelos, vehicularMeta, inmobiliarioMeta, autoSeguroMeta } = useCotizadorData();

  const [marcasDisponibles, setMarcasDisponibles] = useState<string[]>([]);
  const [modelosFiltrados, setModelosFiltrados] = useState<ModeloVehiculo[]>([]);

  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const agenciasDisponibles = form.provincia ? AGENCIAS_POR_PROVINCIA[form.provincia] ?? [] : [];
  const {
    isVehicular,
    isPlanJustoATiempo,
    isPlanAutoSeguro,
    montoFinanciado,
    cuotaMensual,
    inscripcion,
    ofertaMesSeis,
    montoEntrada,
    opcionesJustoATiempo,
  } = useCotizadorCalculations({
    seccion,
    form,
    vehicularMeta,
    inmobiliarioMeta,
    autoSeguroMeta,
  });

  // 2. Filtrar Marcas
  useEffect(() => {
    if (categoriaId && allModelos.length > 0) {
      const filtrados = allModelos.filter(m => coincideTipoCategoria(m.tipo, categoriaId));

      const marcas = Array.from(new Set(filtrados.map(m => m.marca)));
      setMarcasDisponibles(marcas.sort());
      setForm(prev => ({ ...prev, marca: '', modelo: '', precio: 0, imagen: '' }));
      setSubmitMessage('');
    }
  }, [categoriaId, allModelos]);

  // 3. Lógica para determinar la imagen a mostrar
  const getDisplayImage = () => {
    if (seccion === 'VEHICULAR') {
      // Si ya seleccionó un modelo y tiene imagen propia, la mostramos, sino el cubierto
      return form.imagen || "/carroCubierto.png";
    } else {
      // Si es INMOBILIARIA, buscamos la imagen de la categoría seleccionada
      const catData = CATEGORIAS_INMOBILIARIA.find(c => c.id === categoriaId);
      return catData?.imagen || "/casa.jpg"; 
    }
  };

  const handleMarcaChange = (marca: string) => {
    const filtrados = allModelos.filter(m => m.marca === marca && coincideTipoCategoria(m.tipo, categoriaId));
    setModelosFiltrados(filtrados);
    setForm(prev => ({ ...prev, marca, modelo: '', precio: 0, imagen: '' }));
    setSubmitMessage('');
  };

  const handleModeloChange = (nombreModelo: string) => {
    const seleccionado = modelosFiltrados.find(m => m.nombre === nombreModelo);
    if (seleccionado) {
      setForm(prev => ({ ...prev, modelo: nombreModelo, precio: seleccionado.precio, imagen: seleccionado.imagen }));
      setSubmitMessage('');
    }
  };

  const categoriaInmobiliariaSeleccionada = CATEGORIAS_INMOBILIARIA.find(c => c.id === categoriaId);

  const handleFormFieldChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlanChange = (plan: QuotePlan) => {
    setForm(prev => {
      if (plan === 'PLAN_PUNTUACION') {
        return { ...prev, plan, tipoFinanciamiento: 'SIN_ENTRADA' };
      }

      if (plan === 'PLAN_AUTO_SEGURO') {
        return {
          ...prev,
          plan,
          tipoFinanciamiento: 'CON_ENTRADA',
          plazo: 6,
          porcentajeEntrada: 35,
        };
      }

      return { ...prev, plan, tipoFinanciamiento: 'CON_ENTRADA' };
    });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!form.nombre || !form.correo || !form.telefono || !form.aceptaTerminos) {
      setSubmitMessage('Completa nombre, correo, telefono y acepta terminos para continuar.');
      return;
    }

    if (isVehicular && !form.modelo) {
      setSubmitMessage('Selecciona marca y modelo para generar la cotizacion vehicular.');
      return;
    }

    const marcaPayload = isVehicular ? form.marca : 'INMOBILIARIA';
    const modeloPayload = isVehicular ? form.modelo : (categoriaInmobiliariaSeleccionada?.nombre ?? 'INMUEBLE');

    const payload: QuoteData = {
      nombre: form.nombre,
      correo: form.correo,
      telefono: form.telefono,
      tipoProducto: seccion ?? undefined,
      marca: marcaPayload,
      modelo: modeloPayload,
      precio: form.precio,
      meses: form.plazo,
      cuota: cuotaMensual,
      inscripcion,
      cedula: form.cedula,
      provincia: form.provincia,
      ciudad: form.ciudad,
      agencia: form.agencia,
      tipoCliente: form.tipoCliente,
      tipoFinanciamiento: form.tipoFinanciamiento,
      porcentajeEntrada: form.porcentajeEntrada,
      montoEntrada,
      plan: form.plan,
      mesEntrega: isPlanJustoATiempo ? form.mesEntrega : undefined,
      ofertaMesSeis: isPlanAutoSeguro ? ofertaMesSeis : undefined,
    };

    setIsSubmitting(true);
    setSubmitMessage('Procesando cotizacion y enviando correo...');

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'No se pudo enviar la cotizacion.');
      }

      setSubmitMessage('Cotizacion enviada correctamente a tu correo.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ocurrio un error inesperado.';
      setSubmitMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = useCallback(() => {
    setStep(1);
    setSeccion(null);
    setCategoriaId(null);
    setForm(INITIAL_FORM);
    setModelosFiltrados([]);
    setMarcasDisponibles([]);
    setSubmitMessage('');
  }, []);

  useEffect(() => {
    const handleReset = () => reset();
    window.addEventListener('cotizador:reset', handleReset);

    return () => {
      window.removeEventListener('cotizador:reset', handleReset);
    };
  }, [reset]);

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {step === 1 && (
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center py-20">
            <button onClick={() => { setSeccion('VEHICULAR'); setStep(2); }} className="group w-full md:w-1/2 bg-[#001E4E] h-60 rounded-[2.5rem] flex flex-col items-center justify-center transition-all hover:scale-105 shadow-xl">
              <span className="text-white text-3xl font-black uppercase tracking-tighter">Cotización Vehicular</span>
              <div className="h-1 w-12 bg-orange-500 mt-4 group-hover:w-24 transition-all"></div>
            </button>
            <button onClick={() => { setSeccion('INMOBILIARIA'); setStep(2); }} className="group w-full md:w-1/2 bg-[#E35205] h-60 rounded-[2.5rem] flex flex-col items-center justify-center transition-all hover:scale-105 shadow-xl">
              <span className="text-white text-3xl font-black uppercase tracking-tighter">Cotización Inmobiliaria</span>
              <div className="h-1 w-12 bg-blue-900 mt-4 group-hover:w-24 transition-all"></div>
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button onClick={reset} className="mb-8 flex items-center text-[#001E4E] font-bold hover:underline">← VOLVER</button>
            <h2 className="text-4xl font-black text-center mb-12 text-[#001E4E]">¿QUÉ DESEAS ADQUIRIR?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {(seccion === 'VEHICULAR' ? CATEGORIAS_VEHICULAR : CATEGORIAS_INMOBILIARIA).map((cat) => (
                <div key={cat.id} onClick={() => { setCategoriaId(cat.id); setStep(3); }} className="cursor-pointer bg-white border-2 border-gray-100 p-8 rounded-[2.5rem] hover:border-[#E35205] hover:shadow-2xl transition-all text-center group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cat.imagen} alt={cat.nombre} className="h-28 mx-auto mb-4 object-contain group-hover:scale-110 transition-transform" />
                  <span className="font-black uppercase text-sm tracking-widest text-gray-500 group-hover:text-[#001E4E]">{cat.nombre}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in duration-700">
            {/* LADO DE LA IMAGEN DINÁMICA */}
            <div className="bg-slate-50 rounded-[3rem] p-12 flex flex-col items-center justify-center border border-slate-100 relative overflow-hidden">
                <div className="absolute top-10 left-10 text-[120px] font-black text-slate-200 opacity-20 pointer-events-none">FINAN</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={getDisplayImage()} 
                  alt="Vista Previa" 
                  className="w-full max-w-md drop-shadow-2xl z-10 transition-all duration-500"
                />
                {form.precio > 0 && (
                  <div className="mt-10 text-center z-10">
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-2">Valor Estimado:</p>
                    <div className="bg-white px-8 py-4 rounded-2xl shadow-sm inline-block">
                        <span className="text-5xl font-black text-[#001E4E]">{formatCurrency(form.precio)}</span>
                    </div>
                  </div>
                )}
            </div>

            {/* LADO DE LOS SELECTORES */}
            <div className="bg-white rounded-[3rem] shadow-2xl p-10 border border-slate-50">
              <button onClick={() => setStep(2)} className="text-slate-400 text-sm mb-6 hover:text-[#E35205]">← Cambiar tipo</button>
              <h2 className="text-3xl font-black text-[#001E4E] mb-8 uppercase leading-tight">Configura tu <span className="text-[#E35205]">{categoriaId}</span></h2>
              
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black text-[#001E4E] ml-2 mb-1 block uppercase">Marca / Tipo</label>
                        <select className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none" value={form.marca} onChange={(e) => handleMarcaChange(e.target.value)}>
                            <option value="">Seleccionar...</option>
                            {marcasDisponibles.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-[#001E4E] ml-2 mb-1 block uppercase">Modelo / Detalle</label>
                        <select disabled={!form.marca} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none disabled:opacity-30" value={form.modelo} onChange={(e) => handleModeloChange(e.target.value)}>
                            <option value="">Seleccionar...</option>
                            {modelosFiltrados.map(m => <option key={m.nombre} value={m.nombre}>{m.nombre}</option>)}
                        </select>
                    </div>
                </div>

                {form.precio > 0 && (
                    <div className="grid grid-cols-2 gap-4 animate-in zoom-in-95">
                        <div className="bg-[#001E4E] p-4 rounded-2xl text-white text-center">
                            <p className="text-[9px] font-bold opacity-70">CUOTA MENSUAL</p>
                          <p className="text-xl font-black">{formatCurrency(cuotaMensual)}</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-2xl text-[#E35205] text-center">
                            <p className="text-[9px] font-bold opacity-70">INSCRIPCIÓN</p>
                          <p className="text-xl font-black">{formatCurrency(inscripcion)}</p>
                        </div>
                    </div>
                )}

                {isVehicular && form.precio > 0 && (
                  <FinancingSection
                    plan={form.plan}
                    tipoFinanciamiento={form.tipoFinanciamiento}
                    plazo={form.plazo}
                    porcentajeEntrada={form.porcentajeEntrada}
                    mesEntrega={form.mesEntrega}
                    isPlanAutoSeguro={isPlanAutoSeguro}
                    isPlanJustoATiempo={isPlanJustoATiempo}
                    montoEntrada={montoEntrada}
                    ofertaMesSeis={ofertaMesSeis}
                    opcionesJustoATiempo={opcionesJustoATiempo}
                    onPlanChange={handlePlanChange}
                    onTipoFinanciamientoChange={(tipo) =>
                      setForm((prev) => ({
                        ...prev,
                        tipoFinanciamiento: tipo,
                        plan: tipo === 'SIN_ENTRADA'
                          ? 'PLAN_PUNTUACION'
                          : prev.plan === 'PLAN_PUNTUACION'
                            ? 'PLAN_ADELANTADO'
                            : prev.plan,
                      }))
                    }
                    onPlazoChange={(newPlazo) => setForm((prev) => ({ ...prev, plazo: newPlazo }))}
                    onPorcentajeEntradaChange={(porcentaje) => setForm((prev) => ({ ...prev, porcentajeEntrada: porcentaje }))}
                    onMesEntregaChange={(mes) => setForm((prev) => ({ ...prev, mesEntrega: mes }))}
                  />
                )}
                <ClientDataSection
                  form={form}
                  agenciasPorProvincia={AGENCIAS_POR_PROVINCIA}
                  agenciasDisponibles={agenciasDisponibles}
                  submitMessage={submitMessage}
                  montoFinanciado={montoFinanciado}
                  inscripcion={inscripcion}
                  onFieldChange={handleFormFieldChange}
                />

                <button
                  className="w-full bg-[#E35205] text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-[#c44604] transition-all uppercase disabled:opacity-40"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !form.nombre || !form.correo || !form.telefono || (isVehicular && !form.modelo) || !form.aceptaTerminos}
                >
                  {isSubmitting ? 'Enviando...' : 'Obtener Cotizacion'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
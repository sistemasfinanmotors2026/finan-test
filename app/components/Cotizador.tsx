'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CATEGORIAS_VEHICULAR, CATEGORIAS_INMOBILIARIA } from '../constants/cotizador';
import { formatCurrency } from '../lib/utils';
import type { QuoteData, QuotePlan } from '../lib/types';
import type { CotizacionTipo, ModeloVehiculo } from '../types/cotizador';
import { useCotizadorData } from '../hooks/useCotizadorData';
import { useCotizadorCalculations } from '../hooks/useCotizadorCalculations';
import { useCotizadorConEntrada } from '../hooks/useCotizadorConEntrada';
import type { TipoFinanciamiento } from '../types/cotizador-finance';
import { FinancingSection } from './cotizador/FinancingSection';
import { ClientDataSection } from './cotizador/ClientDataSection';
import { PdfPreviewDialog } from './PdfPreviewDialog';
import { CotizadorConEntradaModal } from './CotizadorConEntradaModal';
import { CotizadorSinEntradaModal } from './CotizadorSinEntradaModal';
import type { BuildProformaHtmlInput, PdfOptionRow } from '@/app/lib/formatoPdf';
import { DiscAlbum } from 'lucide-react';
import { error } from 'console';

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

type VehicularFlow = 'ELIGE_CARRO' | 'ELIGE_MONTO' | null;

interface ConEntradaData {
  monto: number;
  plazo: string;
  cuotaMensual: number;
  inscripcion: number;
  porcentajeEntrada: number;
  tasa: string;
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

const obtenerNombreCategoria = (categoriaId: string | null) => {
  const categorias: Record<string, string> = {
    autos: 'Auto',
    suvs: 'SUV',
    camionetas: 'Camioneta',
    camiones: 'Camión',
  };

  return categoriaId ? categorias[categoriaId] ?? categoriaId : '';
};

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
  const [vehicularFlow, setVehicularFlow] = useState<VehicularFlow>(null);
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [showVehicleOptions, setShowVehicleOptions] = useState(false);
  const [showConEntradaModal, setShowConEntradaModal] = useState(false);
  const [showSinEntradaModal, setShowSinEntradaModal] = useState(false);
  const [conEntradaData, setConEntradaData] = useState<ConEntradaData | null>(null);

  const { allModelos, vehicularMeta, inmobiliarioMeta, autoSeguroMeta } = useCotizadorData();
  const { montosDisponibles, calcularCuota, getTasaPorPlazo } = useCotizadorConEntrada();

  const [marcasDisponibles, setMarcasDisponibles] = useState<string[]>([]);
  const [modelosFiltrados, setModelosFiltrados] = useState<ModeloVehiculo[]>([]);

  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfInput, setPdfInput] = useState<BuildProformaHtmlInput | null>(null);

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
    setShowVehicleOptions(false);
    setSubmitMessage('');
  };

  const handleModeloChange = (nombreModelo: string) => {
    const seleccionado = modelosFiltrados.find(m => m.nombre === nombreModelo);
    if (seleccionado) {
      setForm(prev => ({ ...prev, modelo: nombreModelo, precio: seleccionado.precio, imagen: seleccionado.imagen }));
      setShowVehicleOptions(false);
      setSubmitMessage('');
    }
  };

  const handleSelectVehicleCategory = (categoria: string) => {
    setSeccion('VEHICULAR');
    setVehicularFlow('ELIGE_CARRO');
    setCategoriaId(categoria);
    setShowVehicleOptions(false);
    setStep(2);
  };

  const handleContinueToPaymentOptions = () => {
    if (!form.modelo || !form.precio) {
      setSubmitMessage('Selecciona una marca y un modelo antes de continuar.');
      return;
    }

    setShowVehicleOptions(true);
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
      imagenUrl: isVehicular ? form.imagen || '/carroCubierto.png' : undefined,
    };

    setIsSubmitting(true);
    setSubmitMessage('Procesando cotizacion, enviando correo y generando PDF...');

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

      setSubmitMessage('✅ Cotizacion enviada correctamente a tu correo.');
      setIsSubmitted(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ocurrio un error inesperado.';
      setSubmitMessage('⚠️ ' + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePdfInput = (): BuildProformaHtmlInput | null => {
    if (!form.nombre || !form.correo) {
      setSubmitMessage('Completa nombre y correo para generar PDF');
      return null;
    }

    // Generar filas de opciones según plan
    const optionRows: PdfOptionRow[] = [];
    const tasas: Record<string, string> = {
      '24_MESES': '5.5%',
      '36_MESES': '5.84%',
      '48_MESES': '4.38%',
      '60_MESES': '3.5%',
      '72_MESES': '2.92%',
      '84_MESES': '2.92%',
    };

    // Crear una fila por cada opción de plazo común
    [24, 36, 48, 60, 72, 84].forEach((plazo) => {
      const plazoKey = `${plazo}_MESES`;
      optionRows.push({
        plazoLabel: `${plazo} meses`,
        tasaLabel: tasas[plazoKey] || '2.92%',
        cuotaLabel: form.plazo === plazo ? formatCurrency(cuotaMensual) : 'Referencial',
        inscripcionLabel: formatCurrency(inscripcion),
        primerMesLabel: form.plazo === plazo ? formatCurrency(cuotaMensual + inscripcion) : 'N/A',
        selected: form.plazo === plazo,
      });
    });

    return {
      plan: form.plan,
      tipoDocumento: isVehicular ? 'PROFORMA VEHICULAR' : 'PROFORMA INMOBILIARIA',
      client: {
        nombre: form.nombre,
        correo: form.correo,
        telefono: form.telefono,
        cedula: form.cedula,
        ciudad: form.ciudad,
        provincia: form.provincia,
      },
      asset: {
        titulo: isVehicular ? `${form.marca} ${form.modelo}` : (categoriaId || 'Inmueble'),
        monto: form.precio,
        plazoMeses: form.plazo,
        cuota: cuotaMensual,
        inscripcion: inscripcion,
        tipoFinanciamiento: form.tipoFinanciamiento,
      },
      options: optionRows,
      footerText: 'www.finan.ec | Generada por FINAN',
    };
  };

  const handlePreviewPdf = () => {
    const input = generatePdfInput();
    if (input) {
      setPdfInput(input);
      setShowPdfPreview(true);
    }
  };

  const reset = useCallback(() => {
    setStep(1);
    setSeccion(null);
    setVehicularFlow(null);
    setCategoriaId(null);
    setShowVehicleOptions(false);
    setForm(INITIAL_FORM);
    setModelosFiltrados([]);
    setMarcasDisponibles([]);
    setSubmitMessage('');
    setShowPdfPreview(false);
    setPdfInput(null);
    setIsSubmitted(false);
    setShowConEntradaModal(false);
    setShowSinEntradaModal(false);
    setConEntradaData(null);
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
        
        {isSubmitted && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center space-y-6">
              <div className="text-6xl">✅</div>
              <h2 className="text-3xl font-black text-[#001E4E]">¡Éxito!</h2>
              <p className="text-slate-600">
                Tu cotización ha sido enviada correctamente a tu correo electrónico. Te contactaremos pronto.
              </p>
              <button
                onClick={reset}
                className="w-full px-6 py-4 bg-[#001E4E] text-white rounded-lg font-black text-lg hover:bg-blue-900 transition-all uppercase"
              >
                Cotizar Otro Vehículo
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 py-12">
            <h2 className="text-4xl font-black text-center mb-12 text-[#001E4E]">ELIGE TU VEHÍCULO</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {CATEGORIAS_VEHICULAR.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectVehicleCategory(cat.id)}
                  className="cursor-pointer bg-white border-2 border-gray-100 p-8 rounded-[2.5rem] hover:border-[#E35205] hover:shadow-2xl transition-all text-center group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cat.imagen} alt={cat.nombre} className="h-28 mx-auto mb-4 object-contain group-hover:scale-110 transition-transform" />
                  <span className="font-black uppercase text-sm tracking-widest text-gray-500 group-hover:text-[#001E4E]">{cat.nombre}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {step === 2 && seccion === 'VEHICULAR' && (
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
            </div>

            {/* LADO DE LOS SELECTORES */}
            <div className="bg-white rounded-[3rem] shadow-2xl p-10 border border-slate-50">
              <button
                onClick={() => {
                  reset();
                }}
                className="text-slate-400 text-sm mb-6 hover:text-[#E35205]"
              >
                ← VOLVER
              </button>
              <h2 className="text-3xl font-black text-[#001E4E] mb-8 uppercase leading-tight">Configura tu <span className="text-[#E35205]">{obtenerNombreCategoria(categoriaId)}</span></h2>
              <div className="space-y-5">
                {!showVehicleOptions ? (
                  <>
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
                      <>
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

                        <button
                          onClick={handleContinueToPaymentOptions}
                          className="w-full px-4 py-4 bg-[#001E4E] text-white rounded-2xl font-black hover:bg-blue-900 transition uppercase tracking-widest text-sm"
                        >
                          CONTINUAR
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="mt-2 p-4 border-2 border-blue-200 bg-blue-50 rounded-2xl text-center">
                      <p className="font-bold text-[#001E4E] mb-4">¿Cómo deseas pagar tu vehículo?</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowConEntradaModal(true)}
                          className="flex-1 px-4 py-3 bg-[#001E4E] text-white rounded-lg font-bold hover:bg-blue-900 transition uppercase text-sm"
                        >
                          Con Entrada
                        </button>
                        <button
                          onClick={() => setShowSinEntradaModal(true)}
                          className="flex-1 px-4 py-3 bg-gray-300 text-slate-900 rounded-lg font-bold hover:bg-gray-400 transition uppercase text-sm"
                        >
                          Sin Entrada
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {showVehicleOptions && isVehicular && form.precio > 0 && (
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
                {showVehicleOptions && (
                  <>
                    <ClientDataSection
                      form={form}
                      agenciasPorProvincia={AGENCIAS_POR_PROVINCIA}
                      agenciasDisponibles={agenciasDisponibles}
                      submitMessage={submitMessage}
                      montoFinanciado={montoFinanciado}
                      inscripcion={inscripcion}
                      onFieldChange={handleFormFieldChange}
                    />

                    <div className="flex gap-3">
                      <button
                        className="flex-1 bg-[#001E4E] text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-[#000d2e] transition-all uppercase disabled:opacity-40"
                        onClick={handlePreviewPdf}
                        disabled={!form.nombre || !form.correo || !form.precio}
                      >
                         Previsualizar PDF
                      </button>
                      <button
                        className="flex-1 bg-[#E35205] text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-[#c44604] transition-all uppercase disabled:opacity-40"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !form.nombre || !form.correo || !form.telefono || (isVehicular && !form.modelo) || !form.aceptaTerminos}
                      >
                        {isSubmitting ? 'Enviando...' : 'Obtener Cotizacion'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {pdfInput && (
        <PdfPreviewDialog
          open={showPdfPreview}
          onClose={() => setShowPdfPreview(false)}
          pdfInput={pdfInput}
          fileName={`Cotizacion_${form.nombre.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`}
        />
      )}

      {showConEntradaModal && (
        <CotizadorConEntradaModal
          avaluoActual={form.precio}
          imagenSeleccionada={form.imagen || '/carroCubierto.png'}
          marcaModelo={`${form.marca} ${form.modelo}`}
          montosDisponibles={montosDisponibles}
          getTasaPorPlazo={getTasaPorPlazo}
          calcularCuota={calcularCuota}
          onConfirm={(data) => {
            setConEntradaData(data);
            setShowConEntradaModal(false);
            // Actualizar el formulario con los datos de entrada
            setForm(prev => ({
              ...prev,
              plazo: parseInt(data.plazo.split('_')[0]),
              porcentajeEntrada: data.porcentajeEntrada,
              tipoFinanciamiento: 'CON_ENTRADA',
            }));
          }}
          onCancel={() => setShowConEntradaModal(false)}
        />
      )}

      {showSinEntradaModal && (
        <CotizadorSinEntradaModal
          avaluoActual={form.precio}
          imagenSeleccionada={form.imagen || '/carroCubierto.png'}
          marcaModelo={`${form.marca} ${form.modelo}`}
          onConfirm={() => {
            setShowSinEntradaModal(false);
            // Actualizar el formulario sin entrada
            setForm(prev => ({
              ...prev,
              tipoFinanciamiento: 'SIN_ENTRADA',
              porcentajeEntrada: 0,
            }));
          }}
          onCancel={() => setShowSinEntradaModal(false)}
        />
      )}
    </div>
  );
}
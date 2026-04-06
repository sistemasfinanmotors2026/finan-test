'use client';

import React, { useState, useEffect } from 'react';
import { CATEGORIAS_VEHICULAR, CATEGORIAS_INMOBILIARIA } from '../constants/cotizador';

// --- INTERFACES ---
interface ModeloJSON {
  tipo: string;
  nombre: string;
  imagen: string;
  precio: number;
}

interface ItemData extends ModeloJSON {
  marca: string;
}

type Seccion = 'VEHICULAR' | 'INMOBILIARIA' | null;

export default function Cotizador() {
  const [step, setStep] = useState(1);
  const [seccion, setSeccion] = useState<Seccion>(null);
  const [categoriaId, setCategoriaId] = useState<string | null>(null);

  const [allModelos, setAllModelos] = useState<ItemData[]>([]);
  const [marcasDisponibles, setMarcasDisponibles] = useState<string[]>([]);
  const [modelosFiltrados, setModelosFiltrados] = useState<ItemData[]>([]);

  const [form, setForm] = useState({
    marca: '',
    modelo: '',
    precio: 0,
    plazo: 72,
    nombre: '',
    correo: '',
    telefono: '',
    imagen: ''
  });

  // 1. Cargar y transformar JSON
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await fetch('/modelo.json');
        const data = await res.json();
        const listaPlana: ItemData[] = Object.entries(data).flatMap(([marca, modelos]) => {
          return (modelos as ModeloJSON[]).map(m => ({
            ...m,
            marca: marca.toUpperCase(),
          }));
        });
        setAllModelos(listaPlana);
      } catch (error) {
        console.error("Error cargando modelos:", error);
      }
    };
    cargarDatos();
  }, []);

  // 2. Filtrar Marcas
  useEffect(() => {
    if (categoriaId && allModelos.length > 0) {
      const filtrados = allModelos.filter(m => {
        const catNormalizada = categoriaId.toLowerCase().replace(/s$/, '');
        const tipoModelo = m.tipo.toLowerCase();
        if (catNormalizada === 'auto') {
            return tipoModelo === 'hatchback' || tipoModelo === 'sedan' || tipoModelo === 'auto';
        }
        return tipoModelo === catNormalizada;
      });

      const marcas = Array.from(new Set(filtrados.map(m => m.marca)));
      setMarcasDisponibles(marcas.sort());
      setForm(prev => ({ ...prev, marca: '', modelo: '', precio: 0, imagen: '' }));
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
    const filtrados = allModelos.filter(m => {
        const catNormalizada = categoriaId?.toLowerCase().replace(/s$/, '');
        const tipoModelo = m.tipo.toLowerCase();
        const coincideTipo = catNormalizada === 'auto' 
            ? (tipoModelo === 'hatchback' || tipoModelo === 'sedan' || tipoModelo === 'auto')
            : tipoModelo === catNormalizada;
        return m.marca === marca && coincideTipo;
    });
    setModelosFiltrados(filtrados);
    setForm({ ...form, marca, modelo: '', precio: 0, imagen: '' });
  };

  const handleModeloChange = (nombreModelo: string) => {
    const seleccionado = modelosFiltrados.find(m => m.nombre === nombreModelo);
    if (seleccionado) {
      setForm({ ...form, modelo: nombreModelo, precio: seleccionado.precio, imagen: seleccionado.imagen });
    }
  };

  const reset = () => {
    setStep(1);
    setSeccion(null);
    setCategoriaId(null);
    setForm({ marca: '', modelo: '', precio: 0, plazo: 72, nombre: '', correo: '', telefono: '', imagen: '' });
  };

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
                <img 
                  src={getDisplayImage()} 
                  alt="Vista Previa" 
                  className="w-full max-w-md drop-shadow-2xl z-10 transition-all duration-500"
                />
                {form.precio > 0 && (
                  <div className="mt-10 text-center z-10">
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-2">Valor Estimado:</p>
                    <div className="bg-white px-8 py-4 rounded-2xl shadow-sm inline-block">
                        <span className="text-5xl font-black text-[#001E4E]">${form.precio.toLocaleString()}</span>
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
                            <p className="text-xl font-black">${(form.precio / form.plazo).toFixed(2)}</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-2xl text-[#E35205] text-center">
                            <p className="text-[9px] font-bold opacity-70">INSCRIPCIÓN</p>
                            <p className="text-xl font-black">${(form.precio * 0.04).toFixed(2)}</p>
                        </div>
                    </div>
                )}

                <div className="pt-6 space-y-4">
                    <input type="text" placeholder="Tu Nombre" className="w-full p-4 bg-slate-50 rounded-xl outline-none" onChange={(e) => setForm({...form, nombre: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="email" placeholder="Correo" className="p-4 bg-slate-50 rounded-xl outline-none" onChange={(e) => setForm({...form, correo: e.target.value})} />
                        <input type="tel" placeholder="WhatsApp" className="p-4 bg-slate-50 rounded-xl outline-none" onChange={(e) => setForm({...form, telefono: e.target.value})} />
                    </div>
                </div>

                <button className="w-full bg-[#E35205] text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-[#c44604] transition-all uppercase" disabled={!form.modelo || !form.nombre}>
                  Obtener Cotización
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
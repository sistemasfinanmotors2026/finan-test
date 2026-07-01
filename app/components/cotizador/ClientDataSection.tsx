import React, { useState } from 'react';
import { formatCurrency } from '../../lib/utils';

type ClientDataSectionProps = {
  form: {
    nombre: string;
    correo: string;
    telefono: string;
    cedula: string;
    ciudad: string;
    provincia: string;
    agencia: string;
    tipoCliente: string;
    aceptaTerminos: boolean;
    precio: number;
  };
  agenciasPorProvincia: Record<string, string[]>;
  agenciasDisponibles: string[];
  submitMessage: string;
  montoFinanciado: number;
  inscripcion: number;
  onFieldChange: (field: string, value: string | boolean) => void;
};

const getFieldBorderClass = (value: string | boolean, field?: string): string => {
  if (typeof value === 'boolean') return '';
  if (value.toString().trim()) return 'border-2 border-green-500';
  return 'border-2 border-red-500';
};

export function ClientDataSection({
  form,
  agenciasPorProvincia,
  agenciasDisponibles,
  submitMessage,
  montoFinanciado,
  inscripcion,
  onFieldChange,
}: ClientDataSectionProps) {
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const handleFieldBlur = (field: string) => {
    setTouchedFields(prev => new Set(prev).add(field));
  };

  const getInputBorder = (field: string, value: string | boolean): string => {
    if (!touchedFields.has(field)) return '';
    if (typeof value === 'boolean') return '';
    return value.toString().trim() ? 'border-2 border-green-500' : 'border-2 border-red-500';
  };

  return (
    <div className="pt-6 space-y-4">
      <input
        type="text"
        placeholder="Tu Nombre *"
        className={`w-full p-4 bg-slate-50 rounded-xl outline-none transition ${getInputBorder('nombre', form.nombre)}`}
        value={form.nombre}
        onChange={(e) => onFieldChange('nombre', e.target.value)}
        onBlur={() => handleFieldBlur('nombre')}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="email"
          placeholder="Correo *"
          className={`p-4 bg-slate-50 rounded-xl outline-none transition ${getInputBorder('correo', form.correo)}`}
          value={form.correo}
          onChange={(e) => onFieldChange('correo', e.target.value)}
          onBlur={() => handleFieldBlur('correo')}
        />
        <input
          type="tel"
          placeholder="WhatsApp *"
          className={`p-4 bg-slate-50 rounded-xl outline-none transition ${getInputBorder('telefono', form.telefono)}`}
          value={form.telefono}
          onChange={(e) => onFieldChange('telefono', e.target.value)}
          onBlur={() => handleFieldBlur('telefono')}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Cedula"
          className={`p-4 bg-slate-50 rounded-xl outline-none transition ${getInputBorder('cedula', form.cedula)}`}
          value={form.cedula}
          onChange={(e) => onFieldChange('cedula', e.target.value)}
          onBlur={() => handleFieldBlur('cedula')}
        />
        <input
          type="text"
          placeholder="Ciudad"
          className={`p-4 bg-slate-50 rounded-xl outline-none transition ${getInputBorder('ciudad', form.ciudad)}`}
          value={form.ciudad}
          onChange={(e) => onFieldChange('ciudad', e.target.value)}
          onBlur={() => handleFieldBlur('ciudad')}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          className={`p-4 bg-slate-50 rounded-xl outline-none font-bold transition ${getInputBorder('provincia', form.provincia)}`}
          value={form.provincia}
          onChange={(e) => {
            onFieldChange('provincia', e.target.value);
            onFieldChange('agencia', '');
          }}
          onBlur={() => handleFieldBlur('provincia')}
        >
          <option value="">Provincia</option>
          {Object.keys(agenciasPorProvincia).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select
          className={`p-4 bg-slate-50 rounded-xl outline-none font-bold disabled:opacity-30 transition ${getInputBorder('agencia', form.agencia)}`}
          value={form.agencia}
          disabled={!form.provincia}
          onChange={(e) => onFieldChange('agencia', e.target.value)}
          onBlur={() => handleFieldBlur('agencia')}
        >
          <option value="">Agencia</option>
          {agenciasDisponibles.map((ag) => (
            <option key={ag} value={ag}>{ag}</option>
          ))}
        </select>
      </div>
      <select
        className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold"
        value={form.tipoCliente}
        onChange={(e) => onFieldChange('tipoCliente', e.target.value)}
      >
        <option value="PRIMERA_VEZ">Primera vez</option>
        <option value="RENOVACION">Renovacion</option>
      </select>
      <label className="flex items-start gap-3 text-sm text-slate-600 cursor-pointer">
        <input
          type="checkbox"
          checked={form.aceptaTerminos}
          onChange={(e) => onFieldChange('aceptaTerminos', e.target.checked)}
          className="mt-1 w-4 h-4 accent-[#001E4E]"
        />
        <span>Acepto terminos y condiciones para procesamiento de la cotizacion. *</span>
      </label>
      {submitMessage && (
        <p className={`text-sm font-semibold p-3 rounded-lg ${
          submitMessage.toLowerCase().includes('error') || submitMessage.toLowerCase().includes('faltantes')
            ? 'text-red-700 bg-red-50'
            : 'text-green-700 bg-green-50'
        }`}>
          {submitMessage}
        </p>
      )}
      <div className="text-xs text-slate-500">
        {form.precio > 0 && <p>Monto estimado: {formatCurrency(montoFinanciado)}</p>}
        {form.precio > 0 && <p>Inscripcion referencial: {formatCurrency(inscripcion)}</p>}
      </div>
    </div>
  );
}

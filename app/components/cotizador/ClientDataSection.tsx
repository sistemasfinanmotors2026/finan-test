import React from 'react';
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

export function ClientDataSection({
  form,
  agenciasPorProvincia,
  agenciasDisponibles,
  submitMessage,
  montoFinanciado,
  inscripcion,
  onFieldChange,
}: ClientDataSectionProps) {
  return (
    <div className="pt-6 space-y-4">
      <input
        type="text"
        placeholder="Tu Nombre"
        className="w-full p-4 bg-slate-50 rounded-xl outline-none"
        value={form.nombre}
        onChange={(e) => onFieldChange('nombre', e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="email"
          placeholder="Correo"
          className="p-4 bg-slate-50 rounded-xl outline-none"
          value={form.correo}
          onChange={(e) => onFieldChange('correo', e.target.value)}
        />
        <input
          type="tel"
          placeholder="WhatsApp"
          className="p-4 bg-slate-50 rounded-xl outline-none"
          value={form.telefono}
          onChange={(e) => onFieldChange('telefono', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Cedula"
          className="p-4 bg-slate-50 rounded-xl outline-none"
          value={form.cedula}
          onChange={(e) => onFieldChange('cedula', e.target.value)}
        />
        <input
          type="text"
          placeholder="Ciudad"
          className="p-4 bg-slate-50 rounded-xl outline-none"
          value={form.ciudad}
          onChange={(e) => onFieldChange('ciudad', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          className="p-4 bg-slate-50 rounded-xl outline-none font-bold"
          value={form.provincia}
          onChange={(e) => {
            onFieldChange('provincia', e.target.value);
            onFieldChange('agencia', '');
          }}
        >
          <option value="">Provincia</option>
          {Object.keys(agenciasPorProvincia).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select
          className="p-4 bg-slate-50 rounded-xl outline-none font-bold disabled:opacity-30"
          value={form.agencia}
          disabled={!form.provincia}
          onChange={(e) => onFieldChange('agencia', e.target.value)}
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
      <label className="flex items-start gap-3 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={form.aceptaTerminos}
          onChange={(e) => onFieldChange('aceptaTerminos', e.target.checked)}
          className="mt-1"
        />
        <span>Acepto terminos y condiciones para procesamiento de la cotizacion.</span>
      </label>
      {submitMessage && (
        <p className="text-sm font-semibold text-[#001E4E]">{submitMessage}</p>
      )}
      <div className="text-xs text-slate-500">
        {form.precio > 0 && <p>Monto estimado: {formatCurrency(montoFinanciado)}</p>}
        {form.precio > 0 && <p>Inscripcion referencial: {formatCurrency(inscripcion)}</p>}
      </div>
    </div>
  );
}

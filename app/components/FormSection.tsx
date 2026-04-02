"use client";

import { useState } from "react";

export default function FormSection() {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    mensaje: "",
    archivo: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(form);

    alert("Formulario enviado (simulado)");
  };

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-3xl mx-auto">

        <h2 className="text-blue-900 text-3xl font-bold text-center mb-8">
          Postula con Nosotros
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-gray-50 p-8 rounded-xl shadow"
        >
          <input
            type="text"
            placeholder="Nombre completo"
            className="w-full p-3 border rounded border-gray-950 text-blue-950"
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          />

          <input
            type="tel"
            placeholder="Teléfono"
            className="w-full p-3 border rounded border-gray-950 text-blue-950"
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            required
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full p-3 border rounded border-gray-950 text-blue-950"
            onChange={(e) => setForm({ ...form, correo: e.target.value })}
            required
          />

          <textarea
            placeholder="Cuéntanos sobre ti, escribe tu experiencia y por qué quieres unirte a Finan"
            className="w-full h-55 p-3 border rounded border-gray-950 text-blue-950"
            rows={4}
            onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
          />

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition"
          >
            Enviar solicitud
          </button>
        </form>
      </div>
    </section>
  );
}
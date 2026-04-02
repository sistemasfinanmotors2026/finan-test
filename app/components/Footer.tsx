export default function Footer() {
  return (
    <footer className="bg-[#002868] text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-[#F9D923] mb-4">VISÍTANOS</h3>
          <p className="text-sm leading-relaxed">Av. Teniente Hugo Ortíz y Luis Iturralde, edificio San Luis. 4to. Piso</p>
          <p className="text-sm leading-relaxed mt-4">📞 02 392 0522 / Opción 2</p>
          <p className="text-sm leading-relaxed mt-2">✉️ contacto@finanmotors.com</p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#F9D923] mb-4">PÁGINAS DE INTERÉS</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/terminos" className="hover:text-[#D3B67D]">Términos y Condiciones</a></li>
            <li><a href="/trabaja-con-nosotros" className="hover:text-[#D3B67D]">Trabaje con Nosotros</a></li>
            <li><a href="/privacidad" className="hover:text-[#D3B67D]">Políticas de privacidad</a></li>
            <li><a href="/planes" className="hover:text-[#D3B67D]">Planes</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#F9D923] mb-4">Horario de atención</h3>
          <p className="text-sm leading-relaxed">Lunes a Viernes de 09:00 a 18:00</p>
          <p className="text-sm leading-relaxed mt-2">Sábados de 09:00 a 15:00</p>
        </div>
      </div>
      <div className="bg-[#4D4D4D] py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-white text-sm">
          Finan © Todos los derechos reservados 2026
        </div>
      </div>
    </footer>
  );
}

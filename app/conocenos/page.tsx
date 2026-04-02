import Image from "next/image";
import Footer from "@/app/components/Footer";

export default function ConocenosPage() {
  return (
    <main className="flex-1 bg-white text-gray-900">
      {/*Hero section*/}
      <section className="w-full py-16 md:py-20 mt-10 mb-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">En cada paso Finan es tu aliado</h1>
          <p className="text-lg leading-relaxed text-gray-700 justify-end">
            En Finan, hacemos posible que las familias ecuatorianas adquieran su casa o vehículo de forma planificada y programada. Esto se logra gracias a nuestro compromiso con la calidad, la honestidad y el valor agregado. Hemos desarrollado una propuesta para fomentar una cultura de ahorro en nuestros clientes, acompañándolos en la consecución de sus importantes metas.
          </p>
        </div>
      </section>
      {/*mision y vision*/}
      <section
        className="w-full py-16 px-6 md:px-10"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: "url('/mosaico.svg')",
        }}
      >
        <h1 className="text-4xl font-bold text-center mb-12 text-[#032a6a]">Nuestra Misión y Visión</h1>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-xl p-6 md:p-8 bg-white/40 backdrop-blur-[1px]">
            <h2 className="text-5xl md:text-6xl leading-none text-center mb-6 text-[#032a6a]">Misión</h2>
            <p className="text-[1.9rem] text-gray-800 leading-relaxed">
              Brindar un mejor sistema de planificación, para la adquisición de bienes vehiculares e inmobiliarios con calidad, innovación, adaptándonos a las necesidades de nuestros clientes, generando oportunidades que contribuyen al crecimiento del país.
            </p>
          </div>

          <div className="rounded-xl p-6 md:p-8 bg-white/40 backdrop-blur-[1px]">
            <h2 className="text-5xl md:text-6xl leading-none text-center mb-6 text-[#032a6a]">Visión</h2>
            <p className="text-[1.9rem] text-gray-800 leading-relaxed">
              Liderar el mercado nacional e internacional en la adquisición de sistemas de planificación, teniendo como prioridad la eficiencia, compromiso y la mejora continua, optimizando la calidad de vida de todos nuestros clientes y colaboradores.
            </p>
          </div>
        </div>
      </section>
      {/*Lo que nos identifica*/}
      <section className="w-full py-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-lg text-gray-700 mb-6">
            Con Finan, el futuro de tus bienes más importantes se construye con confianza y de forma sencilla.
          </p>

          <h1 className="text-3xl font-bold text-center mb-8">Lo que nos diferencia</h1>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-12">
            {Array.from({ length: 4 }).map((_, index) => (
              <article key={index} className="border border-gray-100 rounded-lg p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full border border-gray-300 flex items-center justify-center">
                  <span className="text-gray-400">SVG</span>
                </div>
                <h2 className="text-xl font-semibold mb-2">Característica {index + 1}</h2>
                <p className="text-gray-600">Descripción breve de la ventaja del servicio y el valor agregado a los clientes.</p>
              </article>
            ))}
          </div>

          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div className="w-full overflow-hidden shadow-lg">
              <Image
                src="/rawpixel.jpg"
                alt="Confiabilidad Finan"
                width={1000}
                height={700}
                className="h-80 w-full object-cover"
                priority
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-4">Compromiso con tu futuro</h1>
              <p className="text-gray-700 leading-relaxed">
                En Finan combinamos experiencia, procesos transparentes y herramientas modernas para que el camino a tu casa o vehículo sea claro, seguro y eficaz. Cada cliente recibe asesoría personalizada y un plan que se ajusta a su ritmo y metas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

"use client";

import SectionCard from "./components/SectionCard";
import SectionCard2 from "./components/SectionCard2";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className=" mt-20 gap-12">
      {/* Página principal vacía */}

      {/* Sección 1: ¿Por Qué Elegirnos? */}
      <SectionCard
        sectionId="section1"
        title="¿Por Qué Elegirnos?"
        paragraphs={[
          "En FINAN hacemos que ese auto o ese inmueble que tanto anhelas sean una realidad, sin complicaciones.",
        ]}
        imagePosition="right"
      />

      {/* Sección 2: Planifica con nosotros */}
      <SectionCard
        sectionId="section2"
        title="Planifica con nosotros."
        paragraphs={[
          "Porque planificar con nosotros también es celebrar.",
          "Por ser nuestro cliente navideño, llévate una canasta para compartir con tus seres queridos con la adquisición de nuestros planes.",
        ]}
        imagePosition="left"
      />
      <SectionCard2
        sectionId="section3"
        title="Planifica tus Metas"
        subtitle="Descubre cómo podemos ayudarte a alcanzar tus metas financieras"
        items={[
          {
            title: "Asesoría Personalizada",
            description: "",
            image: "/fnpage1.jpeg",
            href: "/conocenos"
          },
          {
            title: "Planes de Ahorro",
            description: "",
            image: "/fnpage2.jpeg",
            href: "/planes"
          },
          {
            title: "Créditos Accesibles",
            description: "",
            image: "/fnpage3.jpeg",
            href: "/planes"
          },
          {
            title: "Plan Prueba",
            description: "",
            image: "/fnpage1.jpeg", // ✅ corregido
            href: "/planes"
          },
        ]}
      />

      <Footer />
    </div>
  );
}

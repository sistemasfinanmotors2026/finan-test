"use client";

import Image from "next/image";

interface PlanCardProps {
  title: string;
  description: string;
  bullets: string[];
  image: string;
  imageAlt?: string;
  reverse?: boolean; // para invertir el layout
}

export default function PlanCard({
  title,
  description,
  bullets,
  image,
  imageAlt = "Plan image",
  reverse = false,
}: PlanCardProps) {
  return (
    <section className="w-full bg-gray-100">
      <div
        className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center ${
          reverse ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* TEXTO */}
        <div className="px-8 py-12 md:py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            {title}
          </h2>

          {/* línea decorativa */}
          <div className="w-16 h-1 bg-amber-400 mb-6"></div>

          <p className="text-gray-700 leading-relaxed mb-6">
            {description}
          </p>

          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {bullets.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* IMAGEN */}
        <div className="w-full h-[400px] md:h-[500px] relative">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
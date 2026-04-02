"use client";

import { UserRound, Star,HandHeart,UserRoundPen, Mail, IdCard   } from "lucide-react";
const benefits = [
    {
        title: "EXPERIENCIA",
        desc: "Atención al cliente, Telemercadeo, Gestión de ventas, Comercios de intangibles (no necesario)",
        icon: <UserRound size={47} className="text-amber-400" />
    },
    {
        title: "HABILIDADES",
        desc: "Capacidad de encontrar y generar clientes, Comunicación asertiva, Influencia y negociación Cierre de ventas, Manejo de redes sociales. Brindar seguimiento a la cartera de clientes.",
        icon: <Star size={47} className="text-amber-400" />
    },
    {
        title: "BENEFICIOS",
        desc: "Te brindamos un sin número de oportunidades para poner en práctica tu conocimiento, proponer ideas nuevas y diferentes para tu crecimiento y el de la empresa que se convierte en beneficio de sus clientes y colaboradores.",
        icon: <HandHeart  size={47} className="text-amber-400" />
    },
    {
        title: "TIPO DE CONTRATO",
        desc: "Contrato independiente como tiempo a prueba, Contrato Indefinido luego de cumplir las políticas establecidas de la empresa.",
        icon: <UserRoundPen  size={47} className="text-amber-400" />
    },
];

export default function Benefits() {
    return (
        <section className=" px-6 max-w-5xl mx-auto space-y-10">
            {benefits.map((item, i) => (
                <div
                    key={i}
                    className="flex items-start gap-4 bg-gray-100 px-6 py-8"
                >
                    {/* Icono */}
                    <div className="w-12 h-12 flex items-center justify-center shrink-0">
                        {item.icon}
                    </div>
                    {/* Texto */}
                    <div>
                        <h3 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-2">
                            {item.title}
                        </h3>

                        <p className="text-gray-600 text-base leading-relaxed">
                            {item.desc}
                        </p>
                    </div>
                </div>
            ))}
        </section>
    );
}
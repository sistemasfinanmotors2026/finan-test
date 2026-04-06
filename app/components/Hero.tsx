"use client";
import { IdCard } from "lucide-react";
import Divider from "../components/Divider";
import { use } from "react";

export default function Hero() {
    return (
        <section className="bg-white text-white pt-31 text-center flex flex-col items-center justify-center">
            <h1 className="text-[#041E57] text-4xl md:text-5xl font-bold mb-4">
                En cada paso Finan es tu aliado
            </h1>

            <p className="text-[#041E57] max-w-2xl mx-auto text-lg ">
                En Finan nos estamos reinventando;

                por eso, queremos incorporar el mejor talento a nuestro equipo.
            </p>
            <Divider Icon={IdCard}
            iconBackgroundColor="bg-white-100"
            iconColor="text-blue-900"
            />
        </section>
    );
}
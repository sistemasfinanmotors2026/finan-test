import Image from "next/image";
import Footer from "@/app/components/Footer";
import PlanCard from "../components/PlanCard";

export default function ConocenosPage() {
    return (
        <main className="flex-1 bg-white text-blue-900">
            <div className="flex-col w-full items-center-safe px-6 py-16 md:py-20 mt-10 mb-10">
                <h2 className="text-3xl font-bold mb-4 text-center">Planes para adquirir bienes vehiculares</h2>
            </div>
            {/* Plane Auto Seguro*/}
            <section className="w-full py-16 md:py-20 mt-10 mb-10 bg-[#F8F8F8]">
                <PlanCard
                    title="Plan Auto Seguro"
                    description="A partir del sexto mes se notificará a los clientes a participar en la
                                compra de su auto. Eso sí, para poder ser adjudicado, es indispen-
                                sable que estén al día con el pago de sus cuotas mensuales."
                    bullets={[
                        "Escoge tu monto.",
                        "Paga tus cuotas a tiempo.",
                        "En el 6to mes un asesor te contactará.",
                        "Listo!... prepárate para tu auto.",
                    ]}
                    image="/Plan-Calificacion.jpg"
                />
                {/* Plane Adelantado*/}
                    <PlanCard
                        title="Plan Adelantado"
                        description="Con el Plan Adelantado, además de tus cuotas mensuales, puedes hacer promesas de pago adicionales, donde puedas adquirir bienes inmobiliarios (casas, departamentos, terrenos) y vehículos (nuevos y seminuevos) de forma planificada. "
                        bullets={[
                            "Escoge tu monto.",
                            "Paga tus cuotas a tiempo.",
                            "En el 6to mes un asesor te contactará.",
                            "Listo!... prepárate para tu auto.",
                        ]}
                        image="/Plan-Calificacion.jpg"
                    />
                    {/* Plan Casa */}
                    <PlanCard
                        title="Plan Casa"
                        description="Otro plan con beneficios..."
                        bullets={[
                            "Paso 1",
                            "Paso 2",
                            "Paso 3",
                        ]}
                        image="/casa.jpg"
                        reverse
                    />
                </section>
                <Footer />
        </main >
    );
}
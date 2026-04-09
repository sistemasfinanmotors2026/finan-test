"use client";
import Footer from "@/app/components/Footer";
import PlanCard from "../components/PlanCard";
import Divider from "../components/Divider";
import { House } from "lucide-react";

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
                    image="/Plan-Calificacion.png"

                />
                {/* Plane Adelantado*/}
                <PlanCard
                    title="Plan Adelantado"
                    description={<>Con el Plan Adelantado, además de tus cuotas mensuales, puedes hacer <strong>promesas de pago adicionales, </strong>donde puedas adquirir <strong>bienes inmobiliarios (casas, departamentos, terrenos) y vehículos (nuevos y seminuevos) de forma planificada.</strong></>}
                    paragraphs={[
                        <>Presenta un apromesa de almenos el <strong>15% del valor de tu bien hasta 48 horas antes de nuestras asambleas, </strong> que son el último día hábil de cada mes. ¡Debes estar al día con tus pagos!</>,
                        <>En la asamblea, los clientes con las <strong>promesas de mayor porcentaje son los primeros en ser considerados para la adjudicación.</strong></>,
                        <>¡Es tu oportunidad de ser proactivo y obtener tu bien más rápido!</>
                    ]}
                    image="/Plan-Calificacion.png"
                />
                {/* Plan Casa */}
                <PlanCard
                    title="Plan Puntuación"
                    description={<>Con este plan, acumulas un fondo y, desde tu tercer mes, ya puedes participar en nuestras Asambleas de Adjudicación. Estas se realizan en enero, abril, julio y octubre.</>}
                    bullets={[
                        "60 puntos: Si pagas en los primeros 5 días del mes.",
                        "40 puntos: Si pagas del día 6 al 20 del mes.",
                        "0 puntos: Si pagas del día 21 en adelante.",
                    ]}
                    paragraphs={[
                        <>Estos puntos se acumulan mes a mes. En cada asamblea, los clientes con las puntuaciones acumuladas más altas, junto con su fondo acumulado y comportamiento de pago, son los seleccionados para recibir su bien, siempre que haya recursos disponibles.</>,
                        <>¡Es tu oportunidad de ser proactivo y obtener tu bien más rápido!</>,
                        <>Tu puntuación mensual es clave: </>
                    ]}
                    image="/pln-puntuacion.png"
                    reverse
                />
                <PlanCard
                    title="Plan Justo a Tiempo"
                    description={<><strong>El Plan Justo a Tiempo de Finan </strong>es una opción financiera diseñada para facilitar a los clientes la adquisición de su vehículo de forma flexible y ajustada a sus necesidades. Este plan permite a los clientes comprometerse a pagar un porcentaje determinado del valor total del vehículo al momento de la entrega. Dicho pago inicial oscila entre el 30% y el 50%, dependiendo del monto acordado y el plazo seleccionado.</>}
                    image="/Plan-justo-a-tiempo.png"
                />
                <Divider
                    Icon={House}
                    iconBackgroundColor="bg-white-100"
                    iconColor="text-blue-900"
                />
                <h1 className="text-4xl font-bold text-center text-[#041E57] mb-8 items-center">
                    Planes para adquirir bienes inmobiliarios
                </h1>
                {/* Plan Puntuación */}
                <PlanCard
                    title="Plan Puntuación"
                    description={<>Con este plan, acumulas un fondo y, desde tu tercer mes, ya puedes participar en nuestras Asambleas de Adjudicación. Estas se realizan en enero, abril, julio y octubre.</>}
                    paragraphs={[
                        <>Estos puntos se acumulan mes a mes. En cada asamblea, los clientes con las puntuaciones acumuladas más altas, junto con su fondo acumulado y comportamiento de pago, son los seleccionados para recibir su bien, siempre que haya recursos disponibles.</>,
                        <>¡Es tu oportunidad de ser proactivo y obtener tu bien más rápido!</>,
                        <><strong>Tu puntuación mensual es clave: </strong></>

                    ]}
                    bullets={[
                        "60 puntos: Si pagas en los primeros 5 días del mes.",
                        "40 puntos: Si pagas del día 6 al 20 del mes.",
                        "0 puntos: Si pagas del día 21 en adelante."
                    ]}
                    image="/inmb.jpg"
                />
                {/* Plan Adelantado */}
                <PlanCard
                    title="Plan Adelantado"
                    description={<>Con el Plan Adelantado, además de tus cuotas mensuales, puedes hacer <strong>promesas de pago adicionales, </strong>donde puedas adquirir <strong>bienes inmobiliarios (casas, departamentos, terrenos) y vehículos (nuevos y seminuevos) de forma planificada.</strong></>}
                    paragraphs={[
                        <>Presenta un apromesa de almenos el <strong>15% del valor de tu bien hasta 48 horas antes de nuestras asambleas, </strong> que son el último día hábil de cada mes. ¡Debes estar al día con tus pagos!</>,
                        <>En la asamblea, los clientes con las <strong>promesas de mayor porcentaje son los primeros en ser considerados para la adjudicación.</strong></>,
                        <>¡Es tu oportunidad de ser proactivo y obtener tu bien más rápido!</>
                    ]}
                    image="/inmb2.jpg"
                />
            </section>
            <Footer />
        </main >
    );
}
import Image from "next/image";
import Footer from "@/app/components/Footer";

export default function ConocenosPage() {
    return (
        <main className="flex-1 bg-white text-blue-900">

            {/* ATahualpa */}
            <section className="w-full py-16 md:py-20 mt-10 mb-10 bg-[#F8F8F8]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-center px-6">

                    {/* MAPA */}
                    <div className="w-full h-[300px]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d1994.8902411064335!2d-78.530545!3d-0.249532!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMMKwMTQnNTguMyJTIDc4wrAzMSc1MC4wIlc!5e0!3m2!1ses-419!2sus!4v1775057459799!5m2!1ses-419!2sus"
                            className="w-full h-full border-0 rounded-lg"
                            loading="lazy"
                        />
                    </div>

                    {/* IMAGEN */}
                    <div className="w-full h-[300px]">
                        <Image
                            src="/atahualpa.jpeg"
                            alt="Agencia Atahualpa"
                            width={1000}
                            height={700}
                            className="w-full h-full object-cover rounded-lg"
                            priority
                        />
                    </div>

                    {/* TEXTO */}
                    <div className="text-left">
                        <h2 className="text-3xl font-bold mb-4">
                            Agencia Atahualpa
                        </h2>
                        <p className="text-lg leading-relaxed text-gray-700">
                            Esta ubicada al sur de Quito en la rotonda Atahualpa, cercana a la tribuna del sur.
                        </p>
                    </div>

                </div>
            </section>

            {/* MANTA */}
            <section className="w-full py-16 md:py-20 mt-10 mb-10 bg-[#F8F8F8]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-center px-6">

                    {/* MAPA */}
                    <div className="w-full h-[300px]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d1994.625102797775!2d-80.706249!3d-0.966906!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMMKwNTgnMDAuOSJTIDgwwrA0MicyMi41Ilc!5e0!3m2!1ses-419!2sus!4v1775057986836!5m2!1ses-419!2sus"
                            className="w-full h-full border-0 rounded-lg"
                            loading="lazy"
                        />
                    </div>

                    {/* IMAGEN */}
                    <div className="w-full h-[300px]">
                        <Image
                            src="/manta.jpeg"
                            alt="Agencia Manta"
                            width={1000}
                            height={700}
                            className="w-full h-full object-cover rounded-lg"
                            priority
                        />
                    </div>

                    {/* TEXTO */}
                    <div className="text-left">
                        <h2 className="text-3xl font-bold mb-4">
                            Agencia Manta
                        </h2>
                        <p className="text-lg leading-relaxed text-gray-700">
                            Esta ubicada al frente del Paseo Shopping Manta
                        </p>
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
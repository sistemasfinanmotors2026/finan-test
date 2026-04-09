"use client";

import { motion } from "framer-motion";
import SwiperSlider from "./SwiperSlide";
import { useState, useEffect } from "react";


interface SectionCardProps {
  title: string;
  paragraphs: string[];
  images?: string[]; // Ahora opcional, se cargarán dinámicamente
  sectionId?: string; // Nuevo: ID de la sección para cargar imágenes específicas
  imagePosition?: "left" | "right";
  autoplay?: boolean;
  autoplaySpeed?: number;
}

export default function SectionCard({
  title,
  paragraphs,
  images: propImages,
  sectionId = "default",
  imagePosition = "right",
  autoplay = true,
  autoplaySpeed = 4000,
}: SectionCardProps) {
  const [images, setImages] = useState<string[]>(propImages || []);
  const [isLoading, setIsLoading] = useState(!propImages);

  // Cargar imágenes desde la API si no se pasaron como props
  useEffect(() => {
    if (propImages) return; // Si se pasaron imágenes como props, usar esas

    
    const loadImages = async () => {
      try {
        const response = await fetch(`/api/images?section=${sectionId}`, {
          cache: "no-store",
        });
        const config = await response.json();
        setImages(config.images);
      } catch (error) {
        console.error('Error cargando imágenes:', error);
        // Fallback a imágenes por defecto
        setImages(['/fnpage1.jpeg', '/fnpage2.jpeg', '/fnpage3.jpeg']);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [propImages, sectionId]);

  // Componente del carrusel reutilizable
  const Carousel = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8 px-4">
          <div className="w-full max-w-md aspect-square bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
            <div className="text-gray-500">Cargando imágenes...</div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center py-8 px-4">
        <div
          className="w-full"
          style={{
            maxWidth: "622px",
            maxHeight: "622px",
            width: "100%",
            aspectRatio: "1 / 1",
          }}
        >
          <SwiperSlider
            images={images}
            autoplay={autoplay}
            autoplaySpeed={autoplaySpeed}
          />
        </div>
      </div>
    );
  };

  // Componente del contenido de texto
  const TextContent = () => (
    <div className="p-4 flex flex-col justify-center">
      <h1 className="text-5xl lg:text-6xl text-white font-bold mb-8 leading-tight">
        {title}
      </h1>
      {paragraphs.map((paragraph, index) => (
        <h4
          key={index}
          className={`text-white text-xl lg:text-2xl leading-relaxed ${index > 0 ? "mt-6" : ""
            }`}
        >
          {paragraph}
        </h4>
      ))}
    </div>
  );
  const fadeInLeft = {
    hidden: { opacity: 0, x: -200 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1.2, delay: 0.3, ease: "easeOut" as const },
    },
  };
  const fadeInRight = {
    hidden: { opacity: 0, x: 200 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1.2, delay: 0.3, ease: "easeOut" as const },
    },
  };
  return (
    <div className="w-full bg-linear-to-r from-blue-900 via-blue-950 to-blue-900 flex items-center mb-36">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ml-6">
          {imagePosition === "left" ? (
            <>
              <motion.div
                variants={fadeInLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Carousel />
              </motion.div>
              <motion.div
                variants={fadeInRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <TextContent />
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                variants={fadeInLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <TextContent />
              </motion.div>
              <motion.div
                variants={fadeInRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Carousel />
              </motion.div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
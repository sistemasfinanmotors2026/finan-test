"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface SectionCard2Props {
  title: string;
  subtitle?: string;
  items: { title: string; description: string; image: string, href: string }[];
  sectionId?: string;
}


export default function SectionCard2({
  title,
  subtitle,
  items,
  sectionId = "services",
}: SectionCard2Props) {
  const [dynamicImages, setDynamicImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!sectionId) return;

    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const url = `/api/images?section=${sectionId}`;
        console.log("FETCH URL:", url);
        const response = await fetch(`/api/images?section=${sectionId}`, {
          cache: "no-store",
        });
        const data = await response.json();
        if (data?.images?.length) {
          setDynamicImages(data.images);
        }
      } catch (error) {
        console.error('Error cargando imágenes dinámicas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [sectionId]);

  // Usar imágenes dinámicas si están disponibles, sino usar las del prop items
  const displayItems = dynamicImages.length > 0
    ? items.map((item, idx) => ({
      ...item,
      image: dynamicImages[idx] || item.image
    }))
    : items;

  return (
    <section className="w-full bg-blue-950 py-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white border-t-2 border-b-2 border-amber-400">{title}</h2>
          {subtitle && <p className="mt-2 text-xl text-gray-200">{subtitle}</p>}
        </div>
        {/* div de elementos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayItems.map((item, idx) => (
            <Link
              key={`${sectionId || "static"}-${idx}`}
              href={item.href}
              className="group relative overflow-hidden rounded-xl block"
            >
              {/* Imagen */}
              <div className="relative aspect-square">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  draggable={false}
                />

                {/* Overlay azul */}
                <div className="absolute inset-0 group-hover:bg-blue-900/40 transition duration-500" />

                {/* Contenido centrado */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-semibold tracking-wide text-center px-4">
                    {item.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

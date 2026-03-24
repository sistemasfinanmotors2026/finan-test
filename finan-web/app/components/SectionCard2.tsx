"use client";

import { useEffect, useState } from "react";

interface SectionCard2Props {
  title: string;
  subtitle?: string;
  items: { title: string; description: string; image: string }[];
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
        const response = await fetch(`/api/images?section=${sectionId}`);
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
          <h2 className="text-4xl md:text-5xl font-bold text-white">{title}</h2>
          {subtitle && <p className="mt-2 text-xl text-gray-200">{subtitle}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayItems.map((item, idx) => (
            <article key={`${sectionId || 'static'}-${idx}`} className="group overflow-hidden rounded-xl border border-white/15 bg-white/10 shadow-lg transition hover:shadow-xl">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  draggable={false}
                />
              </div>
              <div className="p-4 justify-center">
                <h3 className="text-xl text-white font-bold mb-2 justify-center">{item.title}</h3>
                <p className="text-gray-200 text-sm leading-relaxed">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

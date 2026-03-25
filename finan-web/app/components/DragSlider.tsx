"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface DragSliderProps {
  images: string[];
  autoplay?: boolean;
  autoplaySpeed?: number;
}

export default function DragSlider({
  images,
  autoplay = true,
  autoplaySpeed = 4000,
}: DragSliderProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragEnd, setDragEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Autoplay effect
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {

      

      setCurrentImage((prev) => (prev + 1) % images.length);

      
    }, autoplaySpeed);


    return () => clearInterval(interval);
  }, [autoplay, autoplaySpeed, images.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragEnd(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const distance = dragStart - dragEnd;
    const threshold = 50;

    if (Math.abs(distance) > threshold) {
      if (distance > 0) {
        // Arrastrar hacia la izquierda = siguiente imagen
        setCurrentImage((prev) => (prev + 1) % images.length);
      } else {
        // Arrastrar hacia la derecha = imagen anterior
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
      }
    }
  };

  // Touch events para móvil
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setDragEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const distance = dragStart - dragEnd;
    const threshold = 50;

    if (Math.abs(distance) > threshold) {
      if (distance > 0) {
        setCurrentImage((prev) => (prev + 1) % images.length);
      } else {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-lg cursor-grab active:cursor-grabbing"
      style={{
        backgroundColor: "#f0f0f0",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Contenedor de imágenes */}
      <div className="relative w-full" style={{ paddingBottom: "100%" }}>
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentImage ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Image
              src={image}
              alt={`Imagen ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 622px"
              className="object-cover"
              priority={index === 0}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Indicadores tipo puntos */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`rounded-full transition-all duration-300 ${
              index === currentImage
                ? "bg-white w-8 h-2.5"
                : "bg-white/50 w-2.5 h-2.5 hover:bg-white/75"
            }`}
            aria-label={`Ir a la diapositiva ${index + 1}`}
          />
        ))}
      </div>

      {/* Indicador de arrastre */}
      {isDragging && (
        <div className="absolute inset-0 bg-black/10 z-5 pointer-events-none" />
      )}
    </div>
  );
}

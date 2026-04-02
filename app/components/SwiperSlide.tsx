"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import Image from "next/image";

interface Props {
  images: string[];
  autoplay?: boolean;
  autoplaySpeed?: number;
}

export default function SwiperSlider({
  images,
  autoplay = true,
  autoplaySpeed = 4000,
}: Props) {
  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={10}
      slidesPerView={1}
      loop
      autoplay={
        autoplay
          ? { delay: autoplaySpeed, disableOnInteraction: false }
          : false
      }
    >
      {images.map((img, index) => (
        <SwiperSlide key={index}>
          <Image
            src={img}
            alt={`img-${index}`}
            width={600}
            height={600}
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
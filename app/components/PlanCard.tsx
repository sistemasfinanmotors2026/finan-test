"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

interface PlanCardProps {
  title: string;
  description?: React.ReactNode;
  paragraphs?: React.ReactNode[];
  bullets?: React.ReactNode[];
  image: string;
  imageAlt?: string;
  reverse?: boolean;
}
const variants = {
  hiddenLeft: { opacity: 0, x: -100 },
  hiddenRight: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0 },
};


export default function PlanCard({
  title,
  description,
  bullets,
  paragraphs,
  image,
  imageAlt = "Plan image",
  reverse = false,
}: PlanCardProps) {
  return (

    <section className="w-full bg-gray-100">

      <motion.div
        variants={variants}
        initial={reverse ? "hiddenRight" : "hiddenLeft"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.8, 0.25, 1],
        }}
        className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center mb-7 ${reverse
          ? "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1"
          : ""
          }`}
      >
        {/* TEXTO */}
        <div className="px-8 py-12 md:py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            {title}
          </h2>

          <div className="w-16 h-1 bg-amber-400 mb-6"></div>

          {description && (
            <p className="text-gray-700 leading-relaxed mb-6">
              {description}
            </p>
          )}

          {paragraphs && (
            <div className="space-y-4 mb-6">
              {paragraphs.map((text, i) => (
                <p key={`p-${i}`} className="text-gray-700 leading-relaxed">
                  {text}
                </p>
              ))}
            </div>
          )}

          {bullets && (
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {bullets.map((item, i) => (
                <li key={`b-${i}`}>{item}</li>
              ))}
            </ul>
          )}
        </div>

        {/* IMAGEN (AHORA CORRECTO) */}
        <div className="w-full h-[400px] md:h-[500px] relative">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
          />
        </div>
      </motion.div>
    </section>
  );
}
"use client";

import { LucideIcon } from "lucide-react";

interface DividerProps {
  Icon: LucideIcon;
  size?: number;
  iconBackgroundColor?: string;
  iconColor?: string;
}

export default function Divider({ Icon, size = 25, iconBackgroundColor = "bg-blue-900", iconColor = "text-white" }: DividerProps) {
  return (
    <div className="w-3/4 mx-auto flex items-center justify-center my-10">
      {/* Línea izquierda */}
      <div className="flex-1 h-[1px] bg-amber-400" />

      {/* Icono centrado */}
      <div className={`mx-4 flex items-center justify-center w-6 h-5.5 rounded ${iconBackgroundColor} ${iconColor}`}>
        <Icon size={size} />
      </div>

      {/* Línea derecha */}
      <div className="flex-1 h-[1px] bg-amber-400" />
    </div>
  );
}
"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const hoverTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        window.clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="bg-white border-b shadow-sm" style={{ borderBottomColor: '#FFEE65' }}>
      <div className="bg-blue-950 pb-12"></div>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0">
            <a href="/">
              <Image
                className="finan_logo h-auto"
                src="/logo.svg"
                alt="Finan logo"
                width={96}
                height={20}
                priority
              />
            </a>
          </div>

          {/* Menu Links */}
          <div className="hidden md:flex space-x-8">
            <a
              href="/"
              className="text-[#041E57] hover:text-[#D3B67D] transition rounded-md px-2 py-1"
            >
              Inicio
            </a>

            {/* Dropdown Menu */}
            <div className="relative">
              <button
                className="text-[#041E57] hover:text-[#D3B67D] transition rounded-md px-2 py-1 flex items-center gap-1"
                onMouseEnter={() => {
                  if (hoverTimeoutRef.current) {
                    window.clearTimeout(hoverTimeoutRef.current);
                  }
                  setIsDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  hoverTimeoutRef.current = window.setTimeout(() => {
                    setIsDropdownOpen(false);
                  }, 120);
                }}
              >
                Que Hacemos
                <svg
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-0 w-58 bg-white border border-zinc-200 dark:border-amber-400  shadow-lg z-50"
                  onMouseEnter={() => {
                    if (hoverTimeoutRef.current) {
                      window.clearTimeout(hoverTimeoutRef.current);
                    }
                    setIsDropdownOpen(true);
                  }}
                  onMouseLeave={() => {
                    hoverTimeoutRef.current = window.setTimeout(() => {
                      setIsDropdownOpen(false);
                    }, 120);
                  }}
                >
                  <a
                    href="/conocenos"
                    className="block px-4 py-2 text-sm text-[#041E57] hover:text-[#D3B67D] transition"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Conocenos
                  </a>
                  <a
                    href="/trabaja-con-nosotros"
                    className="block px-4 py-2 text-sm text-[#041E57] hover:text-[#D3B67D] transition"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Trabaja con nosotros
                  </a>
                  <a
                    href="/agencias"
                    className="block px-4 py-2 text-sm text-[#041E57] hover:text-[#D3B67D] transition"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Agencias
                  </a>
                </div>
              )}
            </div>

            <a
              href="/planes"
              className="text-[#041E57] hover:text-[#D3B67D] transition rounded-md px-2 py-1"
            >
              Planes
            </a>
            <a
              href="/cotizador"
              className="text-[#041E57] hover:text-[#D3B67D] transition rounded-md px-2 py-1"
            >
              Cotizador
            </a>
          </div>

          {/* Mobile Menu Button (opcional) */}
          <button className="md:hidden p-2 rounded-md text-black">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SliderConfig {
  section: string;
  images: string[];
  lastUpdated: string;
}

export default function AdminPage() {
  const router = useRouter();

  const [currentSection, setCurrentSection] = useState('section1');
  const [images, setImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [availableSections] = useState([
    'section1',
    'section2',
    'services'
  ]);

  // 🔥 SOLO carga datos (auth ya lo maneja el proxy)
  useEffect(() => {
    loadConfig();
  }, [currentSection]);

  const loadConfig = async () => {
    try {
      const response = await fetch(`/api/images?section=${currentSection}`, {
        cache: "no-store"
      });

      const config: SliderConfig = await response.json();
      setImages(config.images);
    } catch (error) {
      setMessage('Error al cargar la configuración');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
  await fetch('/api/auth/logout', {
    method: 'POST'
  });

  // 🔥 navegación real (evita conflicto con proxy)
  window.location.href = '/admin/login';
};

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setMessage('Por favor selecciona al menos una imagen');
      return;
    }

    setIsUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch(`/api/images?section=${currentSection}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        setSelectedFiles([]);

        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';

        await loadConfig();
      } else {
        setMessage(result.error || 'Error al subir imágenes');
      }
    } catch (error) {
      setMessage('Error de conexión');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imagePath: string) => {
    if (!confirm('¿Eliminar esta imagen?')) return;

    try {
      const response = await fetch(
        `/api/images?section=${currentSection}&path=${encodeURIComponent(imagePath)}`,
        { method: 'DELETE' }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage('Imagen eliminada');
        await loadConfig();
      } else {
        setMessage(result.error || 'Error al eliminar');
      }
    } catch {
      setMessage('Error de conexión');
    }
  };

  const handleReset = async () => {
    if (!confirm(`Resetear "${currentSection}"?`)) return;

    try {
      const response = await fetch(`/api/images?section=${currentSection}`, {
        method: 'PUT'
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Reseteado correctamente');
        await loadConfig();
      } else {
        setMessage(result.error || 'Error');
      }
    } catch {
      setMessage('Error de conexión');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Sliders por Sección
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Selector de sección */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Seleccionar Sección</h2>
          <div className="flex gap-4 flex-wrap">
            {availableSections.map((section) => (
              <button
                key={section}
                onClick={() => setCurrentSection(section)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  currentSection === section
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {section === 'section1' ? 'Sección 1: ¿Por Qué Elegirnos?' : 
                 section === 'section2' ? 'Sección 2: Planifica con nosotros' :
                 'Servicios: SectionCard2'}
              </button>
            ))}
          </div>
        </div>

        {/* Sección de subida */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Subir Nuevas Imágenes</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar imágenes (máximo 10MB por archivo)
              </label>
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {selectedFiles.length > 0 && (
              <div className="text-sm text-gray-600">
                {selectedFiles.length} archivo{selectedFiles.length !== 1 ? 's' : ''} seleccionado{selectedFiles.length !== 1 ? 's' : ''}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={isUploading || selectedFiles.length === 0}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? 'Subiendo...' : 'Subir Imágenes'}
            </button>
          </div>
        </div>

        {/* Mensajes */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.includes('Error') || message.includes('error')
              ? 'bg-red-100 text-red-700 border border-red-200'
              : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        {/* Imágenes actuales */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Imágenes Actuales del Slider ({images.length})
            </h2>
            <button
              onClick={handleReset}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
              title="Resetear configuración a la original"
            >
              Resetear a Original
            </button>
          </div>

          {images.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay imágenes configuradas
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((imagePath, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square relative overflow-hidden rounded-lg border">
                    <Image
                      src={imagePath}
                      alt={`Imagen ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => handleDelete(imagePath)}
                      className="bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      title="Eliminar imagen"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 truncate">
                    {imagePath.split('/').pop()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instrucciones */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Instrucciones</h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• Selecciona la sección que quieres editar arriba</li>
            <li>• Sube imágenes específicas para cada sección del sitio web</li>
            <li>• Las imágenes se reemplazarán completamente en la sección seleccionada</li>
            <li>• Haz clic en el botón X para eliminar imágenes individuales</li>
            <li>• Los cambios se aplican inmediatamente al sitio web</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
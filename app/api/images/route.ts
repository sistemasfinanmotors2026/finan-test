import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const IMAGES_DIR = join(process.cwd(), 'public', 'uploaded-images');
const CONFIG_FILE = join(process.cwd(), 'public', 'slider-config.json');

interface SliderSection {
  images: string[];
  lastUpdated: string;
}

interface SliderConfig {
  sections: Record<string, SliderSection>;
}

// Asegurar que el directorio existe
if (!existsSync(IMAGES_DIR)) {
  mkdirSync(IMAGES_DIR, { recursive: true });
}

// Función para leer la configuración actual
async function readConfig() {
  try {
    const configData = await readFile(CONFIG_FILE, 'utf-8');
    return JSON.parse(configData) as SliderConfig;
  } catch {
    // Si no existe el archivo, devolver configuración por defecto
    return {
      sections: {
        'default': {
          images: ['/fnpage1.jpeg', '/fnpage2.jpeg', '/fnpage3.jpeg'],
          lastUpdated: new Date().toISOString()
        }
      }
    };
  }
}

// Función para guardar la configuración
async function saveConfig(config: SliderConfig) {
  await writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
}

// GET - Obtener configuración de imágenes para una sección específica
export async function GET(request: NextRequest) {
  try {
    console.log("API HIT"); // 👈 clave

    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section') || 'default';

    const config = await readConfig();

    const sectionConfig = config.sections[section] || {
      images: [],
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      section,
      ...sectionConfig
    });

  } catch (error) {
    console.error("ERROR REAL API:", error);

    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    );
  }
}

// POST - Subir nuevas imágenes para una sección específica
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section') || 'default';

    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No se encontraron archivos' },
        { status: 400 }
      );
    }

    const uploadedImages: string[] = [];
    const config = await readConfig();

    // Asegurar que la sección existe
    if (!config.sections[section]) {
      config.sections[section] = { images: [], lastUpdated: new Date().toISOString() };
    }

    // Procesar cada archivo
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        continue; // Saltar archivos que no son imágenes
      }

      // Generar nombre único para el archivo
      const timestamp = Date.now();
      const extension = file.name.split('.').pop() || 'jpg';
      const filename = `slider-${section}-${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`;
      const filepath = join(IMAGES_DIR, filename);

      // Convertir el archivo a buffer y guardarlo
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      // Agregar a la lista de imágenes subidas
      uploadedImages.push(`/uploaded-images/${filename}`);
    }

    if (uploadedImages.length === 0) {
      return NextResponse.json(
        { error: 'No se pudieron procesar las imágenes' },
        { status: 400 }
      );
    }

    // Actualizar configuración para la sección específica
    config.sections[section].images = uploadedImages;
    config.sections[section].lastUpdated = new Date().toISOString();
    await saveConfig(config);

    return NextResponse.json({
      message: `Se subieron ${uploadedImages.length} imágenes correctamente para la sección "${section}"`,
      section,
      images: uploadedImages,
      config: config.sections[section]
    });

  } catch (error) {
    console.error('Error al subir imágenes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una imagen específica de una sección
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section') || 'default';
    const imagePath = searchParams.get('path');

    if (!imagePath) {
      return NextResponse.json(
        { error: 'Se requiere el parámetro path' },
        { status: 400 }
      );
    }

    const config = await readConfig();

    // Verificar que la sección existe
    if (!config.sections[section]) {
      return NextResponse.json(
        { error: 'Sección no encontrada' },
        { status: 404 }
      );
    }

    // Verificar que la imagen existe en la configuración de la sección
    const imageIndex = config.sections[section].images.indexOf(imagePath);

    if (imageIndex === -1) {
      return NextResponse.json(
        { error: 'Imagen no encontrada en la sección' },
        { status: 404 }
      );
    }

    // Eliminar archivo físico
    const filename = imagePath.replace('/uploaded-images/', '');
    const filepath = join(IMAGES_DIR, filename);

    try {
      await unlink(filepath);
    } catch (fileError) {
      console.warn('No se pudo eliminar el archivo físico:', fileError);
    }

    // Actualizar configuración de la sección
    config.sections[section].images.splice(imageIndex, 1);
    config.sections[section].lastUpdated = new Date().toISOString();
    await saveConfig(config);

    return NextResponse.json({
      message: 'Imagen eliminada correctamente',
      section,
      config: config.sections[section]
    });

  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Resetear configuración de una sección a las imágenes originales
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section') || 'default';

    const config = await readConfig();

    // Configuración original por defecto
    const defaultImages = ['/fnpage1.jpeg', '/fnpage2.jpeg', '/fnpage3.jpeg'];

    // Resetear la sección a la configuración original
    config.sections[section] = {
      images: defaultImages,
      lastUpdated: new Date().toISOString()
    };

    await saveConfig(config);

    return NextResponse.json({
      message: `Configuración de la sección "${section}" reseteada a la original`,
      section,
      config: config.sections[section]
    });

  } catch (error) {
    console.error('Error al resetear configuración:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
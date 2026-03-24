# Sistema de Gestión de Imágenes del Slider

Este proyecto incluye un sistema completo para gestionar las imágenes del slider sin necesidad de conocimientos técnicos.

## 🚀 Cómo Usar

### 1. Acceder al Panel de Administración

Ve a: `http://tu-dominio.com/admin`

### 2. Subir Nuevas Imágenes

1. En el panel de administración, haz clic en "Seleccionar imágenes"
2. Elige una o varias imágenes desde tu computadora
3. Haz clic en "Subir Imágenes"
4. Las imágenes se reemplazarán automáticamente en el slider

### 3. Eliminar Imágenes

1. En la sección "Imágenes Actuales del Slider", verás todas las imágenes
2. Pasa el mouse sobre cualquier imagen para ver el botón de eliminar (X)
3. Haz clic en el botón X para eliminar la imagen

## 📋 Características

- ✅ **Subida múltiple**: Sube varias imágenes a la vez
- ✅ **Validación automática**: Solo acepta archivos de imagen
- ✅ **Reemplazo completo**: Las nuevas imágenes reemplazan todas las anteriores
- ✅ **Eliminación individual**: Elimina imágenes específicas
- ✅ **Actualización en tiempo real**: Los cambios se aplican inmediatamente
- ✅ **Responsive**: Funciona en desktop y móvil

## 🔧 API Endpoints

### GET `/api/images`
Obtiene la configuración actual de imágenes.

**Respuesta:**
```json
{
  "images": ["/uploaded-images/slider-123.jpg", "/uploaded-images/slider-456.jpg"],
  "lastUpdated": "2024-01-01T12:00:00.000Z"
}
```

### POST `/api/images`
Sube nuevas imágenes.

**Body:** FormData con campo `images` (múltiples archivos)

**Respuesta:**
```json
{
  "message": "Se subieron 2 imágenes correctamente",
  "images": ["/uploaded-images/slider-123.jpg", "/uploaded-images/slider-456.jpg"],
  "config": { ... }
}
```

### DELETE `/api/images?path=/uploaded-images/slider-123.jpg`
Elimina una imagen específica.

## 📁 Estructura de Archivos

```
public/
├── slider-config.json          # Configuración actual
├── uploaded-images/            # Imágenes subidas
│   ├── slider-123.jpg
│   └── slider-456.jpg
└── fnpage1.jpeg               # Imágenes originales (fallback)

app/
├── api/images/route.ts        # API endpoints
├── admin/page.tsx             # Panel de administración
└── components/
    ├── SectionCard.tsx        # Componente del slider
    └── DragSlider.tsx         # Slider arrastrable
```

## 🛠️ Configuración Técnica

### Variables de Entorno
No se requieren variables de entorno adicionales.

### Límites
- **Tamaño máximo por archivo**: 10MB (configurable en el código)
- **Formatos soportados**: JPG, PNG, GIF, WebP, SVG
- **Número máximo de archivos**: Sin límite técnico

### Almacenamiento
- Las imágenes se guardan en `public/uploaded-images/`
- La configuración se guarda en `public/slider-config.json`
- Los nombres de archivo incluyen timestamp y hash para evitar conflictos

## 🔒 Seguridad

- Validación de tipos de archivo
- Nombres de archivo únicos para prevenir sobrescrituras
- Eliminación segura de archivos
- Sin acceso directo a filesystem desde el frontend

## 🚨 Notas Importantes

1. **Backup**: Las imágenes originales (`fnpage1.jpeg`, etc.) se mantienen como fallback
2. **Rendimiento**: Las imágenes se sirven desde el mismo dominio para mejor performance
3. **SEO**: Las imágenes incluyen atributos `alt` apropiados
4. **Accesibilidad**: El slider es completamente navegable con teclado

## 🐛 Solución de Problemas

### Las imágenes no se actualizan
- Verifica que el servidor esté ejecutándose
- Revisa la consola del navegador por errores
- Confirma que las imágenes se subieron correctamente en `/admin`

### Error al subir imágenes
- Verifica que los archivos sean imágenes válidas
- Confirma que no excedan el límite de tamaño
- Revisa los permisos de escritura en la carpeta `public/`

### El panel de administración no carga
- Asegúrate de que la ruta `/admin` sea accesible
- Verifica que no haya errores en la consola del servidor
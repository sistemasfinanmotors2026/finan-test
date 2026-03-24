# Sistema de Gestión de Imágenes del Slider - Por Secciones

Este proyecto incluye un sistema completo para gestionar las imágenes del slider por secciones individuales sin necesidad de conocimientos técnicos.

## 🚀 Cómo Usar

### 1. Acceder al Panel de Administración

Ve a: `http://tu-dominio.com/admin`

### 2. Seleccionar la Sección

- **Sección 1**: "¿Por Qué Elegirnos?" (slider derecho)
- **Sección 2**: "Planifica con nosotros" (slider izquierdo)

### 3. Gestionar Imágenes por Sección

1. Selecciona la sección que quieres editar
2. Sube imágenes específicas para esa sección
3. Las imágenes se reemplazarán solo en la sección seleccionada
4. Elimina imágenes individuales con el botón X

## 📋 Características

- ✅ **Gestión por secciones**: Cada SectionCard tiene sus propias imágenes
- ✅ **Subida múltiple**: Sube varias imágenes a la vez por sección
- ✅ **Validación automática**: Solo acepta archivos de imagen
- ✅ **Reemplazo por sección**: Las nuevas imágenes reemplazan solo la sección seleccionada
- ✅ **Eliminación individual**: Elimina imágenes específicas de cada sección
- ✅ **Actualización en tiempo real**: Los cambios se aplican inmediatamente
- ✅ **Responsive**: Funciona en desktop y móvil

## 🔧 API Endpoints

### GET `/api/images?section={sectionId}`
Obtiene la configuración de imágenes para una sección específica.

**Parámetros:**
- `section`: ID de la sección (ej: `section1`, `section2`)

**Respuesta:**
```json
{
  "section": "section1",
  "images": ["/uploaded-images/slider-section1-123.jpg"],
  "lastUpdated": "2024-01-01T12:00:00.000Z"
}
```

### POST `/api/images?section={sectionId}`
Sube nuevas imágenes para una sección específica.

**Parámetros:**
- `section`: ID de la sección

**Body:** FormData con campo `images` (múltiples archivos)

**Respuesta:**
```json
{
  "message": "Se subieron 2 imágenes correctamente para la sección \"section1\"",
  "section": "section1",
  "images": ["/uploaded-images/slider-section1-123.jpg"],
  "config": { ... }
}
```

### DELETE `/api/images?section={sectionId}&path={imagePath}`
Elimina una imagen específica de una sección.

**Parámetros:**
- `section`: ID de la sección
- `path`: Ruta de la imagen a eliminar

## 📁 Estructura de Archivos

```
public/
├── slider-config.json          # Configuración por secciones
├── uploaded-images/            # Imágenes subidas
│   ├── slider-section1-123.jpg # Imágenes de sección 1
│   └── slider-section2-456.jpg # Imágenes de sección 2
└── fnpage1.jpeg               # Imágenes originales (fallback)

app/
├── api/images/route.ts        # API endpoints con soporte de secciones
├── admin/page.tsx             # Panel de administración con selector de secciones
└── components/
    ├── SectionCard.tsx        # Componente con sectionId
    └── DragSlider.tsx         # Slider arrastrable
```

## 🛠️ Configuración Técnica

### Secciones Disponibles
- `section1`: Primera sección del sitio ("¿Por Qué Elegirnos?")
- `section2`: Segunda sección del sitio ("Planifica con nosotros")

### Uso en Componentes
```tsx
// Sección 1
<SectionCard sectionId="section1" title="¿Por Qué Elegirnos?" ... />

// Sección 2
<SectionCard sectionId="section2" title="Planifica con nosotros" ... />
```

### Formato de Configuración
```json
{
  "sections": {
    "section1": {
      "images": ["/uploaded-images/slider-section1-123.jpg"],
      "lastUpdated": "2024-01-01T12:00:00.000Z"
    },
    "section2": {
      "images": ["/uploaded-images/slider-section2-456.jpg"],
      "lastUpdated": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

## 🔒 Seguridad

- Validación de tipos de archivo por sección
- Nombres de archivo únicos con prefijo de sección
- Eliminación segura de archivos por sección
- Sin acceso directo a filesystem desde el frontend

## 🚨 Notas Importantes

1. **Secciones independientes**: Cada sección mantiene sus propias imágenes
2. **Backup automático**: Las imágenes originales se mantienen como fallback
3. **Rendimiento**: Las imágenes se sirven desde el mismo dominio
4. **SEO**: Cada imagen incluye atributos `alt` apropiados
5. **Accesibilidad**: Los sliders son completamente navegables

## 🐛 Solución de Problemas

### Las imágenes no se actualizan en una sección
- Verifica que estés editando la sección correcta
- Confirma que las imágenes se subieron para esa sección específica
- Revisa la consola del navegador por errores

### Error al subir imágenes
- Verifica que los archivos sean imágenes válidas
- Confirma que no excedan el límite de tamaño
- Asegúrate de que la sección esté seleccionada correctamente

### El panel de administración no carga
- Asegúrate de que la ruta `/admin` sea accesible
- Verifica que no haya errores en la consola del servidor</content>
<parameter name="filePath">c:\Users\MSI\Documents\Migracion Finanec\finan-web\SLIDER-README-v2.md
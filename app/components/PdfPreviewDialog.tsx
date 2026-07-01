'use client';

import React, { useState } from 'react';
import { buildProformaHtml, BuildProformaHtmlInput } from '@/app/lib/formatoPdf';

type PdfPreviewDialogProps = {
  open: boolean;
  onClose: () => void;
  pdfInput: BuildProformaHtmlInput;
  fileName?: string;
};

export function PdfPreviewDialog({
  open,
  onClose,
  pdfInput,
  fileName = 'cotizacion.pdf',
}: PdfPreviewDialogProps) {
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  React.useEffect(() => {
    if (open && !previewHtml) {
      (async () => {
        setLoading(true);
        try {
          const html = await buildProformaHtml(pdfInput);
          setPreviewHtml(html);
        } catch (error) {
          console.error('Error generando preview:', error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [open, pdfInput, previewHtml]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pdfInput),
      });
      if (!response.ok) {
        throw new Error('Error al generar PDF');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      console.log('✅ PDF descargado exitosamente');
    } catch (error) {
      console.error('❌ Error descargando PDF:', error);
      alert('Error al descargar el PDF. Intenta nuevamente.');
    } finally {
      setDownloading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '10px',
          width: '90%',
          maxWidth: '900px',
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: '#072386',
            color: 'white',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '10px 10px 0 0',
          }}
        >
          <h2 style={{ margin: 0 }}>📄 Vista Previa del PDF</h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Preview Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {loading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                fontSize: '16px',
                color: '#666',
              }}
            >
              ⏳ Generando vista previa...
            </div>
          ) : (
            previewHtml && (
              <iframe
                srcDoc={previewHtml}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            )
          )}
        </div>

        {/* Footer Buttons */}
        <div
          style={{
            background: '#f5f5f5',
            padding: '16px 24px',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            borderRadius: '0 0 10px 10px',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: '#e0e0e0',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Cerrar
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading || loading}
            style={{
              padding: '10px 24px',
              background: downloading ? '#ccc' : '#E35205',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: downloading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            {downloading ? '⏳ Descargando...' : '⬇️ DESCARGAR PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}

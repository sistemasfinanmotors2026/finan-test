import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { buildProformaHtml, BuildProformaHtmlInput } from '@/app/lib/formatoPdf';

export async function POST(req: Request) {
  try {
    const pdfInput: BuildProformaHtmlInput = await req.json();

    // Generar HTML usando el formato centralizado
    const htmlContent = await buildProformaHtml(pdfInput);

    // Lanzar navegador y generar PDF
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    // Retornar PDF como descarga
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="cotizacion-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error('❌ Error generando PDF:', error);
    return NextResponse.json(
      { error: 'Error al generar el PDF' },
      { status: 500 }
    );
  }
}

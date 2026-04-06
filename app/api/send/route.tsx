import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';
import { QuoteData } from '../../lib/types';

export async function POST(req: Request) {
  try {
    const data: QuoteData = await req.json();

    // 1. Configurar Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    // 2. Generar HTML para el PDF (Estilizado como tu original)
    const htmlContent = `
      <div style="font-family: sans-serif; padding: 40px; border: 1px solid #eee;">
        <h1 style="color: #004a99;">Cotización Finanmotors</h1>
        <p>Estimado/a <strong>${data.nombre}</strong>,</p>
        <hr />
        <p><strong>Vehículo:</strong> ${data.marca} ${data.modelo}</p>
        <p><strong>Monto Planificado:</strong> $${data.precio}</p>
        <p><strong>Plazo:</strong> ${data.meses} meses</p>
        <p><strong>Cuota Mensual:</strong> $${data.cuota.toFixed(2)}</p>
        <p><strong>Inscripción:</strong> $${data.inscripcion.toFixed(2)}</p>
      </div>
    `;

    // 3. Puppeteer genera el PDF
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    // 4. Enviar Email
    await transporter.sendMail({
      from: `"Finanmotors" <${process.env.EMAIL_USER}>`,
      to: data.correo,
      subject: `Tu Cotización: ${data.marca} ${data.modelo}`,
      text: `Hola ${data.nombre}, adjuntamos tu cotización solicitada.`,
      attachments: [{ filename: 'cotizacion.pdf', content: pdfBuffer }],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Error al procesar envío' }, { status: 500 });
  }
}
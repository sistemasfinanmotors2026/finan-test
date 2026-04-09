import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { QuoteData, QuotePlan } from '../../lib/types';
import { formatCurrency } from '../../lib/utils';
import { Buffer } from 'node:buffer';


const JUSTO_TIEMPO_MATRIX: Record<number, Record<number, number>> = {
  24: { 30: 7, 35: 6, 40: 5, 45: 4, 50: 3 },
  36: { 30: 11, 35: 9, 40: 8, 45: 6, 50: 5 },
  48: { 30: 14, 35: 12, 40: 10, 45: 8, 50: 6 },
  60: { 30: 18, 35: 15, 40: 13, 45: 10, 50: 8 },
  72: { 30: 21, 35: 18, 40: 15, 45: 12, 50: 9 },
};

type VehicularMetaRow = {
  MONTO: number;
  INSCRIPCION: number;
  [key: string]: string | number | null;
};

type AutoSeguroMetaRow = {
  MONTO: number;
  CUOTA: number;
  OFERTA: number;
  INSCRIPCION?: number;
};

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const getPlanLabel = (plan?: QuotePlan) => {
  switch (plan) {
    case 'PLAN_ADELANTADO':
      return 'CON ENTRADA - PLAN ADELANTADO';
    case 'PLAN_PUNTUACION':
      return 'SIN ENTRADA - PLAN PUNTUACION';
    case 'PLAN_JUSTO_A_TIEMPO':
      return 'PLAN JUSTO A TIEMPO';
    case 'PLAN_AUTO_SEGURO':
      return 'PLAN AUTO SEGURO';
    default:
      return 'PLAN PERSONALIZADO';
  }
};
async function readMetadataJson<T>(candidates: string[]): Promise<T | null> {
  for (const filename of candidates) {
    const filePath = join(process.cwd(), 'public', 'metadata', filename);
    try {
      const content = await readFile(filePath, 'utf-8');
      return JSON.parse(content) as T;
    } catch {
      // Intentar siguiente candidato
    }
  }
  return null;
};

const findClosestByMonto = <T extends { MONTO: number }>(rows: T[], monto: number) => {
  if (!rows.length || !monto) return null;
  return rows.reduce((closest, current) => {
    const currentDiff = Math.abs(current.MONTO - monto);
    const closestDiff = Math.abs(closest.MONTO - monto);
    return currentDiff < closestDiff ? current : closest;
  });
};

const getTermOptions = (metaRow: VehicularMetaRow | null, tipoProducto?: QuoteData['tipoProducto']) => {
  if (metaRow) {
    const terms = Object.keys(metaRow)
      .map((key) => {
        const match = key.match(/^(\d+)_MESES$/);
        return match ? Number(match[1]) : null;
      })
      .filter((value): value is number => value !== null)
      .sort((a, b) => a - b);

    if (terms.length > 0) {
      return terms;
    }
  }

  return tipoProducto === 'INMOBILIARIA'
    ? [60, 72, 84, 96, 108, 120]
    : [24, 36, 48, 60, 72, 84];
};

const buildEstimatedRows = (data: QuoteData, metaRow: VehicularMetaRow | null) => {
  const termOptions = getTermOptions(metaRow, data.tipoProducto);
  const inscripcion = Number(metaRow?.INSCRIPCION ?? data.inscripcion ?? data.precio * 0.04);

  return termOptions.map((term) => {
    const cuotaFromMeta = Number(metaRow?.[`${term}_MESES`] ?? 0);
    const cuota = data.meses === term && data.cuota > 0
      ? data.cuota
      : cuotaFromMeta;
    const rate = cuota > 0 && data.precio > 0 ? cuota / data.precio : 0;
    const primerMes = cuota + inscripcion;

    return {
      term,
      rate,
      cuota,
      inscripcion,
      primerMes,
      selected: data.meses === term,
    };
  });
};

const buildBaseStyles = () => `
  <style>
    body { font-family: Arial, Helvetica, sans-serif; color: #111; margin: 0; }
    .page { padding: 0 30px 20px; }
    .header-band {
      background: #072386;
      color: #fff;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 -30px 16px;
    }
    .header-band img { height: 20px; object-fit: contain; }
    .title { margin: 8px 0 3px; text-align: center; font-size: 23px; color: #072386; font-weight: 800; letter-spacing: 0.5px; }
    .subtitle { text-align: center; color: #5d71c6; margin-bottom: 14px; font-weight: 700; font-size: 13px; }
    .card { border-radius: 10px; padding: 12px 14px; margin-bottom: 12px; }
    .card-light { background: #f0f4ff; }
    .card-dark { background: #072386; color: #fff; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }
    .label { font-size: 11px; opacity: 0.75; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
    .value { font-size: 14px; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #d9d9d9; font-size: 11px; padding: 7px; text-align: left; }
    th { background: #072386; color: #fff; }
    tr:nth-child(even) td { background: #fafafa; }
    .highlight td { background: #e6eefc !important; color: #072386; font-weight: 700; }
    .note { margin-top: 8px; font-size: 10px; color: #6b6b6b; font-style: italic; }
    .pill { display: inline-block; padding: 5px 10px; border-radius: 999px; background: #e8f4fd; color: #072386; font-size: 11px; font-weight: 700; }
    .footer-band { margin-top: 14px; background: #ff9800; color: #fff; padding: 8px; text-align: center; font-size: 12px; font-weight: 700; }
  </style>
`;

const buildHeader = (plan?: QuotePlan) => `
  <div class="header-band">
    <span>PROFORMA OFICIAL</span>
    <img src="https://finan.ec/wp-content/uploads/2025/12/txt-finan-amarillo.png" alt="Finan" />
  </div>
  <h1 class="title">PROFORMA ${escapeHtml(plan === 'PLAN_JUSTO_A_TIEMPO' || plan === 'PLAN_AUTO_SEGURO' || plan === 'PLAN_ADELANTADO' || plan === 'PLAN_PUNTUACION' ? 'VEHICULAR' : 'FINAN')}</h1>
  <div class="subtitle">${escapeHtml(getPlanLabel(plan))}</div>
`;

const buildClientCard = (data: QuoteData) => `
  <div class="card card-light">
    <div class="label">Informacion del Cliente</div>
    <div class="grid">
      <div><div class="value">${escapeHtml(data.nombre)}</div></div>
      <div><div class="value">${escapeHtml(data.correo)}</div></div>
      <div><div class="value">${escapeHtml(data.telefono)}</div></div>
      <div><div class="value">${escapeHtml(data.cedula || 'No especificado')}</div></div>
      <div><div class="value">${escapeHtml(data.ciudad || 'No especificado')}</div></div>
      <div><div class="value">${escapeHtml(data.provincia || 'No especificado')}</div></div>
    </div>
  </div>
`;

const buildVehicleCard = (data: QuoteData) => `
  <div class="card card-dark">
    <div class="label">Detalle del Bien</div>
    <div class="grid">
      <div><div class="value">${escapeHtml(data.marca)} ${escapeHtml(data.modelo)}</div></div>
      <div><div class="value">Monto: ${escapeHtml(formatCurrency(data.precio))}</div></div>
      <div><div class="value">Plazo: ${escapeHtml(data.meses)} meses</div></div>
      <div><div class="value">Cuota: ${escapeHtml(formatCurrency(data.cuota))}</div></div>
      <div><div class="value">Inscripcion: ${escapeHtml(formatCurrency(data.inscripcion))}</div></div>
      <div><div class="value">Tipo: ${escapeHtml(data.tipoFinanciamiento || 'N/A')}</div></div>
    </div>
  </div>
`;

const buildAdelantadoPdf = (data: QuoteData, metaRow: VehicularMetaRow | null) => `
  <!doctype html><html><head>${buildBaseStyles()}</head><body>
  <div class="page">
    ${buildHeader('PLAN_ADELANTADO')}
    ${buildClientCard(data)}
    ${buildVehicleCard(data)}
    <div class="pill">Plan con entrada y priorizacion por aporte</div>
    <table>
      <thead><tr><th>Plazo</th><th>Tasa Admin.</th><th>Cuota Mensual</th><th>Inscripcion</th><th>Pago Primer Mes</th></tr></thead>
      <tbody>
        ${buildEstimatedRows(data, metaRow).map((row) => `
          <tr${row.selected ? ' class="highlight"' : ''}>
            <td>${row.term} meses</td>
            <td>${(row.rate * 100).toFixed(2)}%</td>
            <td>${row.cuota > 0 ? formatCurrency(row.cuota) : 'N/A'}</td>
            <td>${formatCurrency(row.inscripcion)}</td>
            <td>${row.cuota > 0 ? formatCurrency(row.primerMes) : 'N/A'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="note">La opcion seleccionada por el cliente se resalta en azul. Valores referenciales sujetos a verificacion.</div>
    <div class="footer-band">www.finan.ec</div>
  </div></body></html>
`;

const buildPuntuacionPdf = (data: QuoteData, metaRow: VehicularMetaRow | null) => {
  const scoringRows = [
    { rango: 'Dias 1-5', puntos: 60 },
    { rango: 'Dias 6-20', puntos: 40 },
    { rango: 'Dia 21 en adelante', puntos: 0 },
  ];

  return `
  <!doctype html><html><head>${buildBaseStyles()}</head><body>
  <div class="page">
    ${buildHeader('PLAN_PUNTUACION')}
    ${buildClientCard(data)}
    ${buildVehicleCard(data)}
    <div class="pill">Adjudicacion por puntuacion acumulada</div>
    <table>
      <thead><tr><th>Regla de Puntuacion</th><th>Puntos</th></tr></thead>
      <tbody>
        ${scoringRows.map((r) => `<tr><td>${r.rango}</td><td>${r.puntos}</td></tr>`).join('')}
      </tbody>
    </table>
    <table>
      <thead><tr><th>Plazo</th><th>Cuota Referencial</th><th>Inscripcion</th></tr></thead>
      <tbody>
        ${buildEstimatedRows(data, metaRow).map((row) => `
          <tr${row.selected ? ' class="highlight"' : ''}>
            <td>${row.term} meses</td>
            <td>${row.cuota > 0 ? formatCurrency(row.cuota) : 'N/A'}</td>
            <td>${formatCurrency(row.inscripcion)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="footer-band">Plan Puntuacion - sin entrada</div>
  </div></body></html>
  `;
};

const buildJustoTiempoPdf = (data: QuoteData) => {
  const options = Object.entries(JUSTO_TIEMPO_MATRIX)
    .flatMap(([plazo, porcentajes]) =>
      Object.entries(porcentajes)
        .filter(([, mesEntrega]) => mesEntrega === data.mesEntrega)
        .map(([porcentaje]) => ({
          plazo: Number(plazo),
          porcentaje: Number(porcentaje),
          monto: data.precio * (Number(porcentaje) / 100),
        }))
    );

  return `
  <!doctype html><html><head>${buildBaseStyles()}</head><body>
  <div class="page">
    ${buildHeader('PLAN_JUSTO_A_TIEMPO')}
    ${buildClientCard(data)}
    ${buildVehicleCard(data)}
    <div class="card card-light">
      <div class="label">Entrega deseada</div>
      <div class="value">Mes ${escapeHtml(data.mesEntrega || 'N/A')}</div>
    </div>
    <table>
      <thead><tr><th>Opcion</th><th>Plazo</th><th>Porcentaje</th><th>Calculo</th><th>Monto a pagar</th></tr></thead>
      <tbody>
        ${options.length > 0 ? options.map((op, index) => `<tr><td>${index + 1}</td><td>${op.plazo} meses</td><td>${op.porcentaje}%</td><td>${escapeHtml(formatCurrency(data.precio))} x ${op.porcentaje}%</td><td>${escapeHtml(formatCurrency(op.monto))}</td></tr>`).join('') : '<tr><td colspan="5">No hay opciones para ese mes de entrega.</td></tr>'}
      </tbody>
    </table>
    <div class="note">Opciones generadas segun matriz oficial de meses de entrega y porcentaje de aporte.</div>
    <div class="footer-band">Plan Justo a Tiempo</div>
  </div></body></html>
  `;
};

const buildAutoSeguroPdf = (data: QuoteData, autoRow: AutoSeguroMetaRow | null) => {
  const cuota = Number(autoRow?.CUOTA ?? data.cuota ?? 0) || (data.precio * 0.65) / 6;
  const oferta = Number(autoRow?.OFERTA ?? data.ofertaMesSeis ?? 0) || data.precio * 0.35;

  return `
  <!doctype html><html><head>${buildBaseStyles()}</head><body>
  <div class="page">
    ${buildHeader('PLAN_AUTO_SEGURO')}
    ${buildClientCard(data)}
    ${buildVehicleCard({ ...data, meses: 6, cuota })}
    <div class="pill">Plan especial con pago de 6 meses y oferta final</div>
    <table>
      <thead><tr><th>Mes</th><th>Cuota</th><th>Estado</th></tr></thead>
      <tbody>
        ${Array.from({ length: 6 }, (_, index) => {
    const month = index + 1;
    const highlight = month === 6 ? ' class="highlight"' : '';
    const status = month === 6 ? `Cuota + oferta ${formatCurrency(oferta)}` : 'Pago mensual';
    return `<tr${highlight}><td>Mes ${month}</td><td>${formatCurrency(cuota)}</td><td>${status}</td></tr>`;
  }).join('')}
      </tbody>
    </table>
    <table>
      <thead><tr><th>Resumen</th><th>Valor</th></tr></thead>
      <tbody>
        <tr><td>Total cuotas (6 meses)</td><td>${formatCurrency(cuota * 6)}</td></tr>
        <tr><td>Oferta mes 6</td><td>${formatCurrency(oferta)}</td></tr>
        <tr><td>Total estimado plan</td><td>${formatCurrency(cuota * 5 + oferta)}</td></tr>
      </tbody>
    </table>
    <div class="footer-band">Plan Auto Seguro - entrega en 6 meses</div>
  </div></body></html>
  `;
};

const buildPdfHtmlByPlan = (data: QuoteData, metaRow: VehicularMetaRow | null, autoRow: AutoSeguroMetaRow | null) => {
  switch (data.plan) {
    case 'PLAN_PUNTUACION':
      return buildPuntuacionPdf(data, metaRow);
    case 'PLAN_JUSTO_A_TIEMPO':
      return buildJustoTiempoPdf(data);
    case 'PLAN_AUTO_SEGURO':
      return buildAutoSeguroPdf(data, autoRow);
    case 'PLAN_ADELANTADO':
    default:
      return buildAdelantadoPdf(data, metaRow);
  }
};

export async function POST(req: Request) {
  try {
    const data: QuoteData = await req.json();

    const [vehicularRows, inmobiliarioRows, autoSeguroRows] = await Promise.all([
      readMetadataJson<VehicularMetaRow[]>(['vehicular_M2.json', 'vehicular_M (1).json']),
      readMetadataJson<VehicularMetaRow[]>(['inmobiliario_M2.json']),
      readMetadataJson<AutoSeguroMetaRow[]>(['6meses.json', '6meses (1).json']),
    ]);

    const financingRows = data.tipoProducto === 'INMOBILIARIA'
      ? (inmobiliarioRows ?? [])
      : (vehicularRows ?? []);

    const vehicularRow = findClosestByMonto(financingRows, data.precio);
    const autoSeguroRow = findClosestByMonto(autoSeguroRows ?? [], data.precio);

    // 1. Configurar Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    // 2. Generar HTML para el PDF según el plan
    const htmlContent = buildPdfHtmlByPlan(data, vehicularRow, autoSeguroRow);

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
      subject: `Tu Cotización: ${data.marca} ${data.modelo} - ${getPlanLabel(data.plan)}`,
      text: `Hola ${data.nombre}, adjuntamos tu cotización (${getPlanLabel(data.plan)}). También te contactaremos al ${data.telefono}.`,
      attachments: [
        {
          filename: `cotizacion-${(data.plan || 'plan-personalizado').toLowerCase()}.pdf`,
          content: Buffer.from(pdfBuffer), // <- convertir Uint8Array a Buffer
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Error al procesar envío' }, { status: 500 });
  }
}
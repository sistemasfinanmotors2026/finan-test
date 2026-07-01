import type { QuoteData, QuotePlan } from './types';
import { formatCurrency } from './utils';

export type PdfClientInfo = {
  nombre: string;
  correo: string;
  telefono: string;
  cedula?: string;
  ciudad?: string;
  provincia?: string;
};

export type PdfAssetInfo = {
  titulo: string;
  monto: number;
  plazoMeses: number;
  cuota: number;
  inscripcion: number;
  tipoFinanciamiento?: string;
};

export type PdfOptionRow = {
  plazoLabel: string;
  tasaLabel: string;
  cuotaLabel: string;
  inscripcionLabel: string;
  primerMesLabel: string;
  selected?: boolean;
};

export type PdfMonthlyPaymentRow = {
  mesLabel: string;
  monto: number;
};

export type BuildProformaHtmlInput = {
  plan?: QuotePlan;
  tipoDocumento?: string;
  logoUrl?: string;
  inlineLogo?: boolean;
  client: PdfClientInfo;
  asset: PdfAssetInfo;
  options: PdfOptionRow[];
  note?: string;
  footerText?: string;
  monthlyPayments?: PdfMonthlyPaymentRow[];
};

const DEFAULT_LOGO_URL =
  '/txt-finan-amarillo.png';

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
      return 'PLAN PERSONALIZADO personalizado';
  }
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

const buildHeader = (tipoDocumento: string, subtitle: string, logoUrl: string) => `
  <div style="text-align:center; margin-top:8px;">
    <img src="${escapeHtml(logoUrl)}" alt="Finan" style="width:120px; height:auto; object-fit:contain;" />
    <h1 style="margin:8px 0 0; font-size:20px; color:#222; font-weight:900;">PROFORMA VEHICULAR</h1>
    <div style="color:#6b6b6b; margin-top:6px; font-weight:700;">${escapeHtml(subtitle)}</div>
  </div>
`;

const buildClientCard = (client: PdfClientInfo, primeroRenovacion?: string) => `
  <div style="margin-top:18px;">
    <h3 style="font-size:12px; color:#6b6b6b; margin-bottom:6px;">INFORMACIÓN DEL USUARIO</h3>
    <div style="display:flex; gap:12px;">
      <div style="flex:1;">
        <div style="font-size:10px; color:#6b6b6b;">Nombre</div>
        <div style="font-weight:700; margin-bottom:6px;">${escapeHtml(client.nombre)}</div>

        <div style="font-size:10px; color:#6b6b6b;">Correo</div>
        <div style="font-weight:700; margin-bottom:6px;">${escapeHtml(client.correo)}</div>

        <div style="font-size:10px; color:#6b6b6b;">Provincia</div>
        <div style="font-weight:700; margin-bottom:6px;">${escapeHtml(client.provincia || 'No especificado')}</div>
      </div>

      <div style="flex:1;">
        <div style="font-size:10px; color:#6b6b6b;">Cédula</div>
        <div style="font-weight:700; margin-bottom:6px;">${escapeHtml(client.cedula || 'No especificado')}</div>

        <div style="font-size:10px; color:#6b6b6b;">Teléfono</div>
        <div style="font-weight:700; margin-bottom:6px;">${escapeHtml(client.telefono)}</div>

        <div style="font-size:10px; color:#6b6b6b;">Primero/Renovación</div>
        <div style="font-weight:700;">${escapeHtml(primeroRenovacion || '')}</div>
      </div>
    </div>
  </div>
`;

const buildAssetCard = (asset: PdfAssetInfo, imagenDataUrl?: string, porcentajeEntrada?: number, tasaLabel?: string, montoEstimadoLabel?: string, cuotaLabel?: string) => `
  <div style="margin-top:18px;">
    ${imagenDataUrl ? `<div style="text-align:center; margin-bottom:12px;"><img src="${escapeHtml(imagenDataUrl)}" alt="auto" style="max-width:260px; height:auto; object-fit:contain;" /></div>` : ''}
    <div style="display:flex; gap:12px;">
      <div style="flex:1;">
        <h3 style="font-size:12px; color:#6b6b6b; margin-bottom:6px;">INFORMACIÓN DE COTIZACIÓN</h3>
        <div style="font-size:10px; color:#6b6b6b;">Precio estimado del vehículo</div>
        <div style="font-weight:700; margin-bottom:6px;">${escapeHtml(formatCurrency(asset.monto))}</div>

        <div style="font-size:10px; color:#6b6b6b;">Marca</div>
        <div style="font-weight:700; margin-bottom:6px;">${escapeHtml(asset.titulo.split(' ')[0] || '')}</div>

        <div style="font-size:10px; color:#6b6b6b;">Modelo</div>
        <div style="font-weight:700; margin-bottom:6px;">${escapeHtml(asset.titulo.split(' ').slice(1).join(' ') || '')}</div>
      </div>

      <div style="flex:1;">
        <div style="font-size:10px; color:#6b6b6b;">Meses</div>
        <div style="font-weight:700; margin-bottom:6px;">${escapeHtml(String(asset.plazoMeses))}</div>

        <div style="font-size:10px; color:#6b6b6b;">Monto</div>
        <div style="font-weight:700; margin-bottom:6px;">${escapeHtml(montoEstimadoLabel || '')}</div>

        <div style="font-size:10px; color:#6b6b6b;">Porcentaje de Entrada</div>
        <div style="font-weight:700; margin-bottom:6px;">${escapeHtml(String(porcentajeEntrada ?? ''))}</div>

        <div style="font-size:10px; color:#6b6b6b;">Tasa Administrativa</div>
        <div style="font-weight:700; margin-bottom:6px;">${escapeHtml(tasaLabel || '')}</div>

        <div style="font-size:10px; color:#6b6b6b;">Cuota Fija</div>
        <div style="font-weight:700;">${escapeHtml(cuotaLabel || '')}</div>
      </div>
    </div>
  </div>
`;

const buildOptionsTable = (rows: PdfOptionRow[]) => `
  <table>
    <thead>
      <tr>
        <th>Plazo</th>
        <th>Tasa Admin.</th>
        <th>Cuota Mensual</th>
        <th>Inscripcion</th>
        <th>Pago Primer Mes</th>
        
      </tr>
    </thead>
    <tbody>
      ${rows
        .map(
          (row) => `
        <tr${row.selected ? ' class="highlight"' : ''}>
          <td>${escapeHtml(row.plazoLabel)}</td>
          <td>${escapeHtml(row.tasaLabel)}</td>
          <td>${escapeHtml(row.cuotaLabel)}</td>
          <td>${escapeHtml(row.inscripcionLabel)}</td>
          <td>${escapeHtml(row.primerMesLabel)}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>
`;

const buildMonthlyPaymentsTable = (rows: PdfMonthlyPaymentRow[]) => {
  if (!rows || rows.length === 0) return '';

  return `
  <div class="card card-light">
    <div class="label">Pagos Mensuales</div>
    <table>
      <thead>
        <tr>
          <th>Mes</th>
          <th>Monto</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (r) => `
          <tr>
            <td>${escapeHtml(r.mesLabel)}</td>
            <td>${escapeHtml(formatCurrency(r.monto))}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  </div>
  `;
};

const toDataUrl = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return url;
    }

    const contentType = response.headers.get('content-type') || 'image/png';
    const buffer = Buffer.from(await response.arrayBuffer());
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  } catch {
    return url;
  }
};

export async function buildProformaHtml({
  plan,
  tipoDocumento = 'PROFORMA OFICIAL',
  logoUrl = DEFAULT_LOGO_URL,
  inlineLogo = false,
  client,
  asset,
  options,
  note = 'Los valores mencionados constituyen una estimación aproximada para su plan vehicular',
  footerText = 'www.finanmotors.com',
}: BuildProformaHtmlInput): Promise<string> {
  const subtitle = getPlanLabel(plan);
  const resolvedLogo = inlineLogo ? await toDataUrl(logoUrl) : logoUrl;
  const imagenDataUrl = asset && (asset as any).imagenUrl ? await toDataUrl((asset as any).imagenUrl) : undefined;

  // Determine tasa label based on months
  const tasaByMonths: Record<number, string> = {
    24: '5.5%',
    36: '5.84%',
    48: '4.38%',
    60: '3.5%',
    72: '2.92%',
    84: '2.92%',
  };

  const tasaLabel = tasaByMonths[asset.plazoMeses] || '';

  const montoEstimadoLabel = (() => {
    return formatCurrency(asset.monto);
  })();

  const cuotaLabel = asset.cuota ? formatCurrency(asset.cuota) : '';

  const primeroRenovacion = (client && (client as any).tipoCliente) ? ( (client as any).tipoCliente === 'RENOVACION' ? 'Renovacion' : 'Primera vez' ) : '';

  const resolvedLogoHtml = buildHeader(tipoDocumento, subtitle, resolvedLogo);

  return `
    <!doctype html>
    <html>
      <head>${buildBaseStyles()}</head>
      <body>
        <div class="page">
          ${resolvedLogoHtml}
          ${buildClientCard(client, primeroRenovacion)}
          ${buildAssetCard(asset, imagenDataUrl, (asset as any).porcentajeEntrada, tasaLabel, montoEstimadoLabel, cuotaLabel)}
          ${buildOptionsTable(options)}
          ${buildMonthlyPaymentsTable((arguments[0] as BuildProformaHtmlInput).monthlyPayments || [])}
          <div style="text-align:center; margin-top:20px; color:#6b6b6b; font-style:italic;">${escapeHtml(note)}</div>
          <div style="text-align:center; margin-top:18px; font-weight:700;">${escapeHtml(footerText)}</div>
        </div>
      </body>
    </html>
  `;
}

export function mapQuoteDataToPdfInput(
  data: QuoteData,
  rows: PdfOptionRow[],
  titleOverride?: string
): BuildProformaHtmlInput {
  return {
    plan: data.plan,
    tipoDocumento: titleOverride || `PROFORMA ${data.tipoProducto === 'INMOBILIARIA' ? 'INMOBILIARIA' : 'VEHICULAR'}`,
    client: {
      nombre: data.nombre,
      correo: data.correo,
      telefono: data.telefono,
      cedula: data.cedula,
      ciudad: data.ciudad,
      provincia: data.provincia,
      
    },
    asset: {
      titulo: `${data.marca} ${data.modelo}`,
      monto: data.precio,
      plazoMeses: data.meses,
      cuota: data.cuota,
      inscripcion: data.inscripcion,
      tipoFinanciamiento: data.tipoFinanciamiento,
      
    },
    options: rows,
  };
}

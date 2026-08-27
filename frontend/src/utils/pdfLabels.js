// ============================================================
//  pdfLabels.js — สร้าง PDF จริง กดปุ่มเดียวจบ (html2pdf.js)
//  - buildRollLabelsPdf: สติกเกอร์ QR รายม้วน (กริดเต็มหน้า A4)
//  - buildDocPdf: เอกสารทั่วไป (ใบรับ/ใบเบิก/ใบย้าย/ใบออร์เดอร์)
//  หมายเหตุ: เรนเดอร์ใน overlay ที่ "มองเห็นจริงในจอ" ชั่วขณะ แล้วจับภาพ
//  (ถ้าเรนเดอร์นอกจอ left:-99999px html2canvas จะได้หน้าว่าง)
// ============================================================
import QRCode from 'qrcode';

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ============================================================
//  ข้อมูลบริษัท + โลโก้ (ใช้ร่วมกันในเอกสารพิมพ์ทุกใบ — แก้ที่เดียวคุมทั้งระบบ)
// ============================================================
export const COMPANY_NAME_EN   = 'Plum Flow Solution Co., Ltd.';
export const COMPANY_NAME_CAPS = 'PLUM FLOW SOLUTION CO., LTD.';
export const COMPANY_NAME_TH   = 'บริษัท พลัม โฟลว์ โซลูชั่น จำกัด';
export const COMPANY_ADDRESS    = '55/4 Meesuwan 3 Yeak 1, Sukhumvit 71 Rd. Wattana District, Bangkok, Thailand 10110';
export const COMPANY_ADDRESS_TH = '55/4 ซ.เมืองสุวรรณ 3 แยก 1 ถ.สุขุมวิท 71 เขตวัฒนา กรุงเทพฯ 10110';
export const COMPANY_TEL        = 'Tel: 02-391-5737-39';
export const COMPANY_CONTACT    = 'Mobile/Whatsapp/Line: 085-612-6555';
export const COMPANY_LINE       = 'plumflow';
export const COMPANY_EMAIL      = 'PLUMFLOWSOLUTION@GMAIL.COM';
export const COMPANY_WEBSITE    = 'WWW.PLUMFLOWSOLUTION.COM';

// โลโก้ PLUM (ปุ่ม power ส้ม + ใบ) เป็น SVG inline — เรนเดอร์ในเอกสาร PDF ได้
export function plumLogoSvg(px = 40) {
  const s = Number(px) || 40;
  return `<svg width="${s}" height="${s}" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex:none">
    <defs>
      <linearGradient id="plmO" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF7A29"/><stop offset="1" stop-color="#E8580F"/></linearGradient>
      <linearGradient id="plmL" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#F5A623"/><stop offset="1" stop-color="#FFD24D"/></linearGradient>
    </defs>
    <path d="M74.98 28.91 A40 40 0 1 1 45.02 28.91" fill="none" stroke="url(#plmO)" stroke-width="13" stroke-linecap="round"/>
    <path d="M60 34 L60 67" fill="none" stroke="url(#plmO)" stroke-width="12" stroke-linecap="round"/>
    <path d="M60 35 C66 18 79 12 89 15 C84 28 70 34 60 35 Z" fill="url(#plmL)"/>
    <path d="M60 38 C55 28 46 24 38 27 C44 35 53 39 60 38 Z" fill="url(#plmL)" opacity=".92"/>
  </svg>`;
}

// หัวเอกสารมาตรฐาน (โลโก้ + ชื่อบริษัท + subtitle + ที่อยู่) — สำหรับใบ Instruction/รับ/ย้าย
export function docBrandHeader(subtitle = '') {
  return `<div style="display:flex;align-items:center;justify-content:center;gap:12px">
      ${plumLogoSvg(46)}
      <div style="text-align:center">
        <div class="h1">${COMPANY_NAME_EN}</div>
        ${subtitle ? `<div class="h2">${subtitle}</div>` : ''}
      </div>
    </div>
    <div class="center addr">${COMPANY_ADDRESS}</div>
    <div class="center addr">${COMPANY_TEL}&nbsp;&nbsp;&nbsp;${COMPANY_CONTACT}</div>`;
}

// ---- แกนกลาง: HTML → PDF (เรนเดอร์ในจอจริงเพื่อให้จับภาพได้แน่นอน) ----
async function htmlToPdf(innerHtml, { filename = 'document.pdf', format = 'a4', orientation = 'portrait', margin = [8, 8, 8, 8], width = '190mm', open = true, download = false } = {}) {
  const html2pdf = (await import('html2pdf.js')).default;

  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed; inset:0; z-index:2147483000; background:#ffffff; overflow:auto; padding:6mm 0;';
  const banner = document.createElement('div');
  banner.textContent = 'กำลังสร้าง PDF…';
  banner.style.cssText = 'position:fixed; top:8px; left:50%; transform:translateX(-50%); background:#111; color:#fff; padding:6px 16px; border-radius:20px; font-family:sans-serif; font-size:13px; z-index:2147483001;';
  const wrap = document.createElement('div');
  wrap.style.cssText = `width:${width}; margin:0 auto; background:#ffffff; font-family:'Noto Sans Thai','Tahoma',sans-serif; color:#111;`;
  wrap.innerHTML = innerHtml;
  overlay.appendChild(wrap);
  document.body.appendChild(overlay);
  document.body.appendChild(banner);

  // รอ layout + รูป (QR data URL) ให้ decode เสร็จก่อนจับภาพ
  await new Promise((r) => setTimeout(r, 60));
  try {
    const imgs = Array.from(wrap.querySelectorAll('img'));
    await Promise.all(imgs.map((im) => (im.complete ? Promise.resolve() : new Promise((res) => { im.onload = im.onerror = res; }))));
  } catch (e) { /* ข้าม */ }

  try {
    const worker = html2pdf().set({
      margin,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true, backgroundColor: '#ffffff', scrollX: 0, scrollY: 0 },
      jsPDF: { unit: 'mm', format, orientation },
      pagebreak: { mode: ['css', 'legacy'] },
    }).from(wrap);

    if (download) { await worker.save(); return null; }
    const blob = await worker.outputPdf('blob');
    const url = URL.createObjectURL(blob);
    if (open) {
      const win = window.open(url, '_blank');
      if (!win) { const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); }  // popup ถูกบล็อก → ดาวน์โหลดแทน
    }
    return url;
  } finally {
    document.body.removeChild(overlay);
    document.body.removeChild(banner);
  }
}

// ---- เอกสารพอดีเนื้อหา (สลิป/ใบเสร็จ): กว้างคงที่ สูง = เท่าเนื้อหา (เต็ม ไม่เหลือขาว) ----
//  ใช้ html2canvas + jsPDF ตรงๆ เพื่อคุมขนาดได้แน่นอน
export async function buildFittedPdf(innerHtml, { widthMm = 72.1, padMm = 3, filename = 'document.pdf', open = true, download = false } = {}) {
  const [jspdfMod, h2cMod] = await Promise.all([import('jspdf'), import('html2canvas')]);
  const JsPDF = jspdfMod.jsPDF || jspdfMod.default;
  const html2canvas = h2cMod.default || h2cMod;

  // เรนเดอร์ใน iframe แยกเอกสาร → CSS ของแอปไม่รั่วเข้ามาทับ (หัวตาราง/สี/QR ตรงตามที่ออกแบบ)
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText = `position:fixed; left:0; top:0; width:${widthMm}mm; height:40mm; border:0; background:#fff; z-index:2147483000; opacity:0.01; pointer-events:none;`;
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(`<!doctype html><html><head><meta charset="utf-8"><style>
      *{margin:0;padding:0;box-sizing:border-box;}
      html,body{background:#fff;}
      body{font-family:'Noto Sans Thai','Tahoma',sans-serif;color:#111;}
      #wrap{width:${widthMm}mm;padding:${padMm}mm;background:#fff;}
    </style></head><body><div id="wrap">${innerHtml}</div></body></html>`);
  doc.close();

  await new Promise((r) => setTimeout(r, 60));
  try {
    const imgs = Array.from(doc.querySelectorAll('img'));
    await Promise.all(imgs.map((im) => (im.complete ? Promise.resolve() : new Promise((res) => { im.onload = im.onerror = res; }))));
  } catch (e) { /* ข้าม */ }

  try {
    const wrapEl = doc.getElementById('wrap');
    iframe.style.height = Math.max(20, wrapEl.scrollHeight) + 'px';   // ให้ iframe สูงพอจับภาพครบ
    await new Promise((r) => setTimeout(r, 30));
    const canvas = await html2canvas(wrapEl, { scale: 3, useCORS: true, backgroundColor: '#ffffff', windowWidth: wrapEl.scrollWidth, windowHeight: wrapEl.scrollHeight });
    const pageH = Math.max(10, widthMm * canvas.height / canvas.width);
    const pdf = new JsPDF({ unit: 'mm', format: [widthMm, pageH], orientation: pageH >= widthMm ? 'portrait' : 'landscape' });
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, widthMm, pageH);
    if (download) { pdf.save(filename); return null; }
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    if (open) { const w = window.open(url, '_blank'); if (!w) { const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); } }
    return url;
  } finally {
    document.body.removeChild(iframe);
  }
}

// ---- เอกสารทั่วไป A4 (ใบรับ/ใบเบิก/ใบย้าย/PO/สัญญา) — iframe แยก (กัน CSS รั่ว) + หลายหน้า ----
export async function buildDocPdf(innerHtml, { filename = 'document.pdf', open = true, download = false } = {}) {
  const [jspdfMod, h2cMod] = await Promise.all([import('jspdf'), import('html2canvas')]);
  const JsPDF = jspdfMod.jsPDF || jspdfMod.default;
  const html2canvas = h2cMod.default || h2cMod;

  const M = 8;                 // ขอบกระดาษ (มม.)
  const pageW = 210, pageH = 297;   // A4 portrait
  const contentW = pageW - M * 2;   // 194 มม.

  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText = `position:fixed; left:0; top:0; width:${contentW}mm; height:40mm; border:0; background:#fff; z-index:2147483000; opacity:0.01; pointer-events:none;`;
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(`<!doctype html><html><head><meta charset="utf-8"><style>
      *{margin:0;padding:0;box-sizing:border-box;}
      html,body{background:#fff;}
      body{font-family:'Noto Sans Thai','Tahoma',sans-serif;color:#111;font-size:13px;}
      #wrap{width:${contentW}mm;background:#fff;}
    </style></head><body><div id="wrap">${innerHtml}</div></body></html>`);
  doc.close();

  await new Promise((r) => setTimeout(r, 60));
  try {
    const imgs = Array.from(doc.querySelectorAll('img'));
    await Promise.all(imgs.map((im) => (im.complete ? Promise.resolve() : new Promise((res) => { im.onload = im.onerror = res; }))));
  } catch (e) { /* ข้าม */ }

  try {
    const wrapEl = doc.getElementById('wrap');
    iframe.style.height = Math.max(20, wrapEl.scrollHeight) + 'px';
    await new Promise((r) => setTimeout(r, 30));
    const canvas = await html2canvas(wrapEl, { scale: 2.5, useCORS: true, backgroundColor: '#ffffff', windowWidth: wrapEl.scrollWidth, windowHeight: wrapEl.scrollHeight });

    const pdf = new JsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const pxPerMm = canvas.width / contentW;         // แปลง px → mm
    const pageSlicePx = Math.floor((pageH - M * 2) * pxPerMm);   // สูงเนื้อหาต่อหน้า (px)
    let y = 0, first = true;
    while (y < canvas.height) {
      const sliceH = Math.min(pageSlicePx, canvas.height - y);
      const slice = document.createElement('canvas');
      slice.width = canvas.width; slice.height = sliceH;
      slice.getContext('2d').drawImage(canvas, 0, y, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
      const hmm = sliceH / pxPerMm;
      if (!first) pdf.addPage();
      pdf.addImage(slice.toDataURL('image/jpeg', 0.95), 'JPEG', M, M, contentW, hmm);
      first = false; y += sliceH;
    }
    if (download) { pdf.save(filename); return null; }
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    if (open) { const w = window.open(url, '_blank'); if (!w) { const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); } }
    return url;
  } finally {
    document.body.removeChild(iframe);
  }
}

// ---- สติกเกอร์ QR รายม้วน — 1 ดวง/หน้า ขนาด Stock 2 (3.14 x 2.36 นิ้ว = 79.76 x 59.94 มม.) ----
//  วาดทีละดวงด้วย jsPDF (1 หน้า/ดวง เต็มพอดี ไม่มีหน้าว่างคั่น)
//  labels: [{ title, sub, lot, qty, barcode, roll }]
export async function buildRollLabelsPdf(labels, { open = true, download = false, filename = 'labels.pdf' } = {}) {
  if (!labels || !labels.length) return null;
  const [jspdfMod, h2cMod] = await Promise.all([import('jspdf'), import('html2canvas')]);
  const JsPDF = jspdfMod.jsPDF || jspdfMod.default;
  const html2canvas = h2cMod.default || h2cMod;
  const W = 79.76, H = 59.94;  // ขนาดสติกเกอร์ (มม.)

  // เตรียม QR ล่วงหน้า
  const qrs = [];
  for (const l of labels) {
    let qr = '';
    try { qr = await QRCode.toDataURL(String(l.barcode || ''), { width: 260, margin: 0 }); } catch (e) { /* ข้าม */ }
    qrs.push(qr);
  }

  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed; inset:0; z-index:2147483000; background:#e5e5e5; overflow:auto; padding:8mm 0;';
  const banner = document.createElement('div');
  banner.textContent = 'กำลังสร้าง PDF…';
  banner.style.cssText = 'position:fixed; top:8px; left:50%; transform:translateX(-50%); background:#111; color:#fff; padding:6px 16px; border-radius:20px; font-family:sans-serif; font-size:13px; z-index:2147483001;';
  // โลโก้ PLUM แบบสีเรียบ (ไม่ใช้ gradient) เพื่อให้ html2canvas เรนเดอร์ชัวร์
  const flatLogo = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <path d="M74.98 28.91 A40 40 0 1 1 45.02 28.91" fill="none" stroke="#E8580F" stroke-width="13" stroke-linecap="round"/>
      <path d="M60 34 L60 67" fill="none" stroke="#E8580F" stroke-width="12" stroke-linecap="round"/>
      <path d="M60 35 C66 18 79 12 89 15 C84 28 70 34 60 35 Z" fill="#F5A623"/>
      <path d="M60 38 C55 28 46 24 38 27 C44 35 53 39 60 38 Z" fill="#F5A623"/>
    </svg>`;

  overlay.innerHTML = `
    <style>
      .lbl { width:${W}mm; height:${H}mm; box-sizing:border-box; padding:2.2mm 2.8mm; margin:0 auto 6mm; background:#fff; overflow:hidden;
             display:flex; flex-direction:column; color:#000; font-family:'Noto Sans Thai','Tahoma',sans-serif; }
      .lbl-brand { display:flex; align-items:center; gap:1.6mm; background:#f2f3f7; border:1px solid #d6dae6; border-radius:1.4mm; padding:.8mm 1.8mm; margin-bottom:1.2mm; }
      .lbl-brand svg { width:5.8mm; height:5.8mm; flex:none; }
      .lbl-co { font-size:8pt; font-weight:800; letter-spacing:.1px; color:#1a1f2e; line-height:1.05; }
      .lbl-hd { font-size:12pt; line-height:1.05; margin-bottom:1.6mm; }
      .lbl-hd b { font-weight:800; }
      .k { color:#000; font-weight:700; margin-right:1.1mm; }
      .lbl-color { font-size:8.5pt; padding-bottom:1mm; border-bottom:1.4px solid #000; overflow:hidden; white-space:nowrap; }
      .lbl-roll { float:right; color:#555; font-size:7.5pt; font-weight:700; }
      .lbl-body { flex:1; display:flex; gap:2mm; padding-top:1.4mm; min-height:0; }
      .lbl-meta { flex:1; display:flex; flex-direction:column; justify-content:flex-start; font-size:10pt; }
      .lbl-meta > div { line-height:1.1; margin-bottom:1.9mm; }
      .lbl-meta > div:last-child { margin-bottom:0; }
      .lbl-struct { font-size:8pt; }
      .lbl-right { width:26mm; display:flex; flex-direction:column; align-items:center; justify-content:center; border-left:1.5px solid #000; padding-left:2mm; }
      .lbl-right img { width:24mm; height:24mm; display:block; }
      .lbl-bc { font-family:'Courier New',monospace; font-size:8.5pt; font-weight:700; margin-top:.8mm; letter-spacing:.3px; }
    </style>
    ${labels.map((l, i) => `
      <div class="lbl">
        <div class="lbl-brand">${flatLogo}<span class="lbl-co">${esc(COMPANY_NAME_EN)}</span></div>
        <div class="lbl-hd"><span class="k">Code</span> <b>${esc(l.title || '')}</b></div>
        <div class="lbl-color"><span class="k">Color</span> ${esc(l.sub || '')}${l.roll ? `<span class="lbl-roll">ม้วน ${esc(l.roll)}</span>` : ''}</div>
        <div class="lbl-body">
          <div class="lbl-meta">
            <div><span class="k">LOT</span> ${esc(l.lot || '-')}</div>
            <div><span class="k">QTY</span> ${esc(l.qty || '-')}</div>
            ${l.width ? `<div><span class="k">Width</span> ${esc(l.width)}</div>` : ''}
            ${l.comp ? `<div class="lbl-struct"><span class="k">Comp</span> ${esc(l.comp)}</div>` : ''}
          </div>
          <div class="lbl-right">${qrs[i] ? `<img src="${qrs[i]}"/>` : ''}<div class="lbl-bc">${esc(l.barcode || '')}</div></div>
        </div>
      </div>`).join('')}`;
  document.body.appendChild(overlay);
  document.body.appendChild(banner);

  await new Promise((r) => setTimeout(r, 60));
  try {
    const imgs = Array.from(overlay.querySelectorAll('img'));
    await Promise.all(imgs.map((im) => (im.complete ? Promise.resolve() : new Promise((res) => { im.onload = im.onerror = res; }))));
  } catch (e) { /* ข้าม */ }

  try {
    const els = Array.from(overlay.querySelectorAll('.lbl'));
    const pdf = new JsPDF({ unit: 'mm', format: [W, H], orientation: 'landscape' });
    for (let i = 0; i < els.length; i++) {
      const canvas = await html2canvas(els[i], { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
      if (i > 0) pdf.addPage([W, H], 'landscape');
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, W, H);
    }
    if (download) { pdf.save(filename); return null; }
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    if (open) { const w = window.open(url, '_blank'); if (!w) { const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); } }
    return url;
  } finally {
    document.body.removeChild(overlay);
    document.body.removeChild(banner);
  }
}

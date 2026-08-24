// ============================================================
//  pdfLabels.js — สร้าง PDF จริง กดปุ่มเดียวจบ (html2pdf.js)
//  - buildRollLabelsPdf: สติกเกอร์ QR รายม้วน (กริดเต็มหน้า A4)
//  - buildDocPdf: เอกสารทั่วไป (ใบรับ/ใบเบิก/ใบย้าย/ใบออร์เดอร์)
//  หมายเหตุ: เรนเดอร์ใน overlay ที่ "มองเห็นจริงในจอ" ชั่วขณะ แล้วจับภาพ
//  (ถ้าเรนเดอร์นอกจอ left:-99999px html2canvas จะได้หน้าว่าง)
// ============================================================
import QRCode from 'qrcode';

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

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

  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed; inset:0; z-index:2147483000; background:#ffffff; overflow:auto;';
  const banner = document.createElement('div');
  banner.textContent = 'กำลังสร้าง PDF…';
  banner.style.cssText = 'position:fixed; top:8px; left:50%; transform:translateX(-50%); background:#111; color:#fff; padding:6px 16px; border-radius:20px; font-family:sans-serif; font-size:13px; z-index:2147483001;';
  const wrap = document.createElement('div');
  wrap.style.cssText = `width:${widthMm}mm; box-sizing:border-box; padding:${padMm}mm; margin:8mm auto; background:#ffffff; font-family:'Noto Sans Thai','Tahoma',sans-serif; color:#111;`;
  wrap.innerHTML = innerHtml;
  overlay.appendChild(wrap);
  document.body.appendChild(overlay);
  document.body.appendChild(banner);

  await new Promise((r) => setTimeout(r, 60));
  try {
    const imgs = Array.from(wrap.querySelectorAll('img'));
    await Promise.all(imgs.map((im) => (im.complete ? Promise.resolve() : new Promise((res) => { im.onload = im.onerror = res; }))));
  } catch (e) { /* ข้าม */ }

  try {
    const canvas = await html2canvas(wrap, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
    const pageH = Math.max(10, widthMm * canvas.height / canvas.width);
    const pdf = new JsPDF({ unit: 'mm', format: [widthMm, pageH], orientation: pageH >= widthMm ? 'portrait' : 'landscape' });
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, widthMm, pageH);
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

// ---- เอกสารทั่วไป ----
export async function buildDocPdf(innerHtml, { filename = 'document.pdf', format = 'a5', open = true, download = false, width, margin, orientation } = {}) {
  const w = width || (format === 'a4' ? '190mm' : format === 'a6' ? '96mm' : '132mm');
  return htmlToPdf(innerHtml, { filename, format, orientation, margin, width: w, open, download });
}

// ---- สติกเกอร์ QR รายม้วน — 1 ดวง/หน้า ขนาด Stock 2 (3.14 x 2.36 นิ้ว = 79.76 x 59.94 มม.) ----
//  labels: [{ title, sub, lot, qty, barcode, roll }]
export async function buildRollLabelsPdf(labels, { open = true, download = false, filename = 'labels.pdf' } = {}) {
  const cards = [];
  for (let i = 0; i < labels.length; i++) {
    const l = labels[i];
    let qr = '';
    try { qr = await QRCode.toDataURL(String(l.barcode || ''), { width: 260, margin: 0 }); } catch (e) { /* ข้าม */ }
    const last = i === labels.length - 1;
    cards.push(`
      <div class="lbl"${last ? ' style="page-break-after:auto"' : ''}>
        <div class="lbl-hd"><span class="k">Code</span> <b>${esc(l.title || '')}</b></div>
        <div class="lbl-color"><span class="k">color</span> ${esc(l.sub || '')}${l.roll ? `<span class="lbl-roll">ม้วนที่ ${esc(l.roll)}</span>` : ''}</div>
        <div class="lbl-body">
          <div class="lbl-meta">
            <div>LOT ${esc(l.lot || '')}</div>
            <div>QTY ${esc(l.qty || '')}</div>
          </div>
          <div class="lbl-right">
            ${qr ? `<img src="${qr}"/>` : ''}
            <div class="lbl-bc">${esc(l.barcode || '')}</div>
          </div>
        </div>
      </div>`);
  }
  const innerHtml = `
    <style>
      .lbl { width:73mm; height:54mm; padding:0; page-break-after:always; box-sizing:border-box;
             display:flex; flex-direction:column; color:#000; }
      .lbl-hd { font-size:13pt; line-height:1.2; }
      .lbl-hd b { font-weight:700; }
      .lbl-color { font-size:10pt; padding-bottom:2.5mm; border-bottom:1.5px solid #000; overflow:hidden; }
      .k { color:#000; margin-right:2mm; }
      .lbl-roll { float:right; color:#444; font-size:8.5pt; }
      .lbl-body { flex:1; display:flex; align-items:center; padding-top:3mm; }
      .lbl-meta { flex:1; font-size:12pt; line-height:2.2; }
      .lbl-right { width:30mm; text-align:center; border-left:1.5px solid #000; padding-left:2mm; }
      .lbl-right img { width:24mm; height:24mm; display:block; margin:0 auto; }
      .lbl-bc { font-family:'Courier New',monospace; font-size:9pt; font-weight:700; margin-top:1mm; }
    </style>
    ${cards.join('')}`;
  return htmlToPdf(innerHtml, {
    filename, open, download,
    format: [79.76, 59.94], orientation: 'landscape', margin: [3, 3, 3, 3], width: '73mm',
  });
}

// ============================================================
//  pdfLabels.js — สร้างสติกเกอร์ QR เป็น PDF จริง กดปุ่มเดียวจบ
//  ใช้ html2pdf.js (html2canvas + jsPDF) เรนเดอร์ HTML → PDF
//  รองรับฟอนต์ไทย + QR ครบ, จัดเป็นกริดเต็มหน้ากระดาษ A4
//  labels: [{ title, sub, lot, qty, barcode }]
// ============================================================
import QRCode from 'qrcode';

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export async function buildRollLabelsPdf(labels, { open = true, download = false, filename = 'labels.pdf' } = {}) {
  const html2pdf = (await import('html2pdf.js')).default;

  // สร้างการ์ดสติกเกอร์ (ฝัง QR เป็นรูป)
  const cards = [];
  for (const l of labels) {
    let qr = '';
    try { qr = await QRCode.toDataURL(String(l.barcode || ''), { width: 240, margin: 0 }); } catch (e) { /* ไม่มี QR ก็ข้าม */ }
    cards.push(`
      <div class="lbl">
        <div class="lbl-title">${esc(l.title || '')}</div>
        <div class="lbl-sub"><span class="lbl-k">color</span> ${esc(l.sub || '')}</div>
        <div class="lbl-mid">
          <div class="lbl-meta">
            <div>LOT ${esc(l.lot || '')}</div>
            <div>QTY ${esc(l.qty || '')}</div>
          </div>
          <div class="lbl-qr">${qr ? `<img src="${qr}"/>` : ''}<div class="lbl-bc">${esc(l.barcode || '')}</div></div>
        </div>
      </div>`);
  }

  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed; left:-99999px; top:0; width:190mm; background:#fff;';
  wrap.innerHTML = `
    <style>
      .sheet { display:grid; grid-template-columns:repeat(2,1fr); gap:5mm; font-family:'Noto Sans Thai','Tahoma',sans-serif; color:#111; }
      .lbl { border:1px solid #111; border-radius:2mm; padding:3mm 3.5mm; page-break-inside:avoid; }
      .lbl-title { font-size:13pt; font-weight:700; margin-bottom:1mm; }
      .lbl-sub { font-size:9.5pt; padding-bottom:2mm; border-bottom:1px solid #111; }
      .lbl-k { color:#555; margin-right:3mm; }
      .lbl-mid { display:flex; align-items:center; justify-content:space-between; gap:3mm; padding-top:2.5mm; }
      .lbl-meta { font-size:11pt; font-weight:600; line-height:1.9; }
      .lbl-qr { text-align:center; }
      .lbl-qr img { width:26mm; height:26mm; display:block; }
      .lbl-bc { font-family:'Courier New',monospace; font-size:8.5pt; font-weight:700; margin-top:1mm; }
    </style>
    <div class="sheet">${cards.join('')}</div>`;
  document.body.appendChild(wrap);

  try {
    const worker = html2pdf().set({
      margin: [8, 8, 8, 8],
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    }).from(wrap);

    if (download) { await worker.save(); return null; }
    const blob = await worker.outputPdf('blob');
    const url = URL.createObjectURL(blob);
    if (open) window.open(url, '_blank');
    return url;
  } finally {
    document.body.removeChild(wrap);
  }
}

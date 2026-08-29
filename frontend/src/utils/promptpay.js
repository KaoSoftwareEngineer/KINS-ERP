// สร้าง payload มาตรฐาน PromptPay (EMVCo) สำหรับทำ QR ชำระเงิน — ล็อกยอดเงินได้
// รองรับ: เบอร์มือถือ (10 หลัก), เลขบัตรประชาชน (13 หลัก), e-Wallet (15 หลัก)
function tlv(id, value) {
  const len = String(value.length).padStart(2, '0');
  return id + len + value;
}
function sanitize(id) { return String(id || '').replace(/[^0-9]/g, ''); }
function formatTarget(id) {
  const n = sanitize(id);
  if (n.length >= 13) return n;                       // เลขบัตร ปชช. / e-Wallet
  return ('0000000000000' + n.replace(/^0/, '66')).slice(-13); // เบอร์มือถือ → 13 หลัก (66 + เบอร์)
}
function crc16(str) {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

// คืน string payload สำหรับป้อนให้ QRCode.toDataURL()
export function promptpayPayload(id, amount) {
  const target = sanitize(id);
  if (!target) return '';
  const acctType = target.length >= 15 ? '03' : (target.length >= 13 ? '02' : '01');
  const merchant = tlv('00', 'A000000677010111') + tlv(acctType, formatTarget(id));
  let payload =
    tlv('00', '01') +
    tlv('01', amount ? '12' : '11') +
    tlv('29', merchant) +
    tlv('53', '764') +
    (amount ? tlv('54', Number(amount).toFixed(2)) : '') +
    tlv('58', 'TH');
  payload += '6304';
  return payload + crc16(payload);
}

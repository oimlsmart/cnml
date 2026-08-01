/**
 * PEM / DER / base64 transformations.
 *
 * Leaf utility — no internal dependencies, no WebCrypto. Pure string
 * and byte operations. Used by key import/export, trust import, XML
 * signing (for cert stripping), and cert generation.
 */

const PEM_RE = /-----BEGIN ([A-Z0-9 ]+)-----\n([\s\S]*?)\n-----END \1-----/;

export function pemToDer(pem: string): { der: ArrayBuffer; label: string } {
  const m = pem.match(PEM_RE);
  if (!m) throw new Error("Invalid PEM format");
  const label = m[1];
  const b64 = m[2].replace(/\n/g, "");
  const der = base64ToBuffer(b64);
  return { der, label };
}

export function derToPem(der: ArrayBuffer, label: string): string {
  const b64 = bufferToBase64(der);
  const lines = b64.match(/.{1,64}/g)?.join("\n") ?? b64;
  return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----\n`;
}

function base64ToBuffer(b64: string): ArrayBuffer {
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

function bufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

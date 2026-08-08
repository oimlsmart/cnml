/**
 * PEM / DER / base64 transformations.
 *
 * Leaf utility — uses the shared base64 encoder/decoder. Pure string
 * and byte operations. Used by key import/export, trust import, XML
 * signing (for cert stripping), and cert generation.
 */

import { bytesToBase64, base64ToBytes } from "./shared/base64.ts";

const PEM_RE = /-----BEGIN ([A-Z0-9 ]+)-----\n([\s\S]*?)\n-----END \1-----/;

export function pemToDer(pem: string): { der: ArrayBuffer; label: string } {
  const m = pem.match(PEM_RE);
  if (!m) throw new Error("Invalid PEM format");
  const label = m[1];
  const b64 = m[2]!.replace(/\n/g, "");
  return { der: base64ToBytes(b64).buffer, label };
}

export function derToPem(der: ArrayBuffer, label: string): string {
  const b64 = bytesToBase64(new Uint8Array(der));
  const lines = b64.match(/.{1,64}/g)?.join("\n") ?? b64;
  return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----\n`;
}

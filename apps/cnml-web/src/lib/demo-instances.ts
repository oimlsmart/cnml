/**
 * Demo instance configuration for the static build.
 *
 * Production deployments replace this with a lookup against the
 * transparency log + instance cert store. Each entry maps a CNML
 * certificate identifier to the device identity and OIML
 * Recommendation the instance cert was issued under.
 *
 * The Recommendation is referenced by ID only here; the title is
 * resolved at render time from the schemas package so the source
 * of truth stays with the per-R YAML.
 */

import type { PassportDevice } from "./passport";

export interface DemoInstance {
  certId: string;
  device: PassportDevice;
  recommendationId: string;
  /** Certificate validity period (ISO-8601 dates). */
  issuedAt?: string;
  expiresAt?: string;
}

export const DEMO_INSTANCES: readonly DemoInstance[] = [
  {
    certId: "CNML-DEMO-INSTANCE",
    device: {
      manufacturer: null,
      model: null,
      serial: null,
    },
    recommendationId: "R60",
    issuedAt: "2026-01-15",
    expiresAt: "2031-01-15",
  },
];

export const DEFAULT_DEMO_CERT_ID: string = DEMO_INSTANCES[0]!.certId;

export function findDemoInstance(certId: string): DemoInstance | undefined {
  return DEMO_INSTANCES.find((d) => d.certId === certId);
}

export function demoStaticPaths() {
  return DEMO_INSTANCES.map((d) => ({ params: { certid: d.certId } }));
}

/**
 * SMI twin client (TODO.cnml/11).
 *
 * Connects to a SMART Measuring Instrument's /twin GraphQL endpoint.
 * The twin exposes:
 *
 *   - getIndication() — the current measurement value
 *   - watchState(callback) — subscribe to state transitions
 *   - getProvenance() — the CNML certificate reference
 *
 * The client uses the standard fetch API. No external GraphQL
 * library — the query strings are small and typed.
 *
 * The endpoint is configurable. In production, it points at the
 * instrument's own /twin endpoint (or a gateway that proxies it).
 * In the demo, it points at a local SST simulator instance.
 */

/** The current measurement indication from a SMART instrument. */
export interface Indication {
  value: number;
  unit: string;
  timestamp: string;
  quality: "valid" | "invalid" | "warning";
}

/** The instrument's operational state. */
export interface TwinState {
  status: "measuring" | "idle" | "error" | "calibrating";
  lastChangedAt: string;
}

/** The provenance linking the instrument to its CNML certificate. */
export interface Provenance {
  cnmlCertificateId: string;
  passportUrl: string;
  chainFingerprint: string;
  modelCertificateId: string;
  manufacturer: string;
  model: string;
}

/** Unsubscribe function returned by watchState. */
export type Unsubscribe = () => void;

/** Connection status. */
export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

const QUERY_INDICATION = `
  query GetIndication {
    indication {
      value
      unit
      timestamp
      quality
    }
  }
`;

const QUERY_STATE = `
  query GetState {
    state {
      status
      lastChangedAt
    }
  }
`;

const QUERY_PROVENANCE = `
  query GetProvenance {
    provenance {
      cnmlCertificateId
      passportUrl
      chainFingerprint
      modelCertificateId
      manufacturer
      model
    }
  }
`;


export class TwinClient {
  private endpoint: string;
  private status: ConnectionStatus = "disconnected";
  private pollInterval: ReturnType<typeof setInterval> | null = null;
  private stateListeners: Array<(state: TwinState) => void> = [];

  constructor(endpoint: string) {
    this.endpoint = endpoint.replace(/\/$/, "");
  }

  /**
   * Test the connection. Returns the connection status.
   * Does not throw on failure — the caller decides how to handle
   * errors (retry, degrade, show a message).
   */
  async connect(): Promise<ConnectionStatus> {
    this.status = "connecting";
    try {
      const res = await this.query(QUERY_STATE);
      if (res.data?.state) {
        this.status = "connected";
      } else {
        this.status = "error";
      }
    } catch {
      this.status = "error";
    }
    return this.status;
  }

  disconnect(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.status = "disconnected";
    this.stateListeners = [];
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  /** Fetch the current measurement indication. */
  async getIndication(): Promise<Indication> {
    const res = await this.query(QUERY_INDICATION);
    return res.data.indication as Indication;
  }

  /** Fetch the instrument's current state. */
  async getState(): Promise<TwinState> {
    const res = await this.query(QUERY_STATE);
    return res.data.state as TwinState;
  }

  /**
   * Fetch the provenance linking the instrument to its CNML
   * certificate. The passportUrl field points at the passport
   * endpoint where the full certificate chain is served.
   */
  async getProvenance(): Promise<Provenance> {
    const res = await this.query(QUERY_PROVENANCE);
    return res.data.provenance as Provenance;
  }

  /**
   * Subscribe to state changes. The callback fires on each
   * transition. Returns an unsubscribe function.
   *
   * Uses polling (every 2 seconds) as the default transport.
   * SMART instruments that support WebSocket subscriptions would
   * replace this with a real subscription; the interface is
   * the same.
   */
  watchState(callback: (state: TwinState) => void): Unsubscribe {
    this.stateListeners.push(callback);

    if (!this.pollInterval) {
      this.pollInterval = setInterval(async () => {
        if (this.status !== "connected") return;
        try {
          const state = await this.getState();
          for (const listener of this.stateListeners) {
            listener(state);
          }
        } catch {
          // Network errors during polling are non-fatal.
        }
      }, 2000);
    }

    return () => {
      this.stateListeners = this.stateListeners.filter((l) => l !== callback);
    };
  }

  /** Execute a GraphQL query via fetch. */
  private async query(query: string, variables?: Record<string, unknown>): Promise<{ data: Record<string, unknown> }> {
    const res = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
      throw new Error(`Twin endpoint returned ${res.status}: ${res.statusText}`);
    }

    const json = await res.json() as { data?: Record<string, unknown>; errors?: Array<{ message: string }> };

    if (json.errors?.length) {
      throw new Error(`GraphQL errors: ${json.errors.map((e) => e.message).join("; ")}`);
    }

    if (!json.data) {
      throw new Error("GraphQL response missing data field");
    }

    return json as { data: Record<string, unknown> };
  }
}

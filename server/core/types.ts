/**
 * Core Server Types & HTTP Request/Response Contracts
 */

export interface ServerRequest {
  method: string;
  url: string;
  path: string;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, string | string[] | undefined>;
  body: unknown;
  clientIp?: string;
}

export interface ServerResponse {
  status: number;
  headers?: Record<string, string>;
  data: unknown;
}

export type CoreHandler = (req: ServerRequest) => Promise<ServerResponse>;

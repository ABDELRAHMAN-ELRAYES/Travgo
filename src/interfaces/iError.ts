export interface iError extends Error {
  statusCode?: number;
  status?: string;
}

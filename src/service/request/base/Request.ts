export type RequestClientQuery = Record<string, unknown> | undefined;
export type RequestClientBody = Record<string, unknown> | undefined;
export type RequestClientResponseData = unknown;
export type RequestClientResponse<Res> = {
  status: number;
  headers: Record<string, string>;
  body: Res;
};

export interface Request<Body = RequestClientBody, Query = RequestClientQuery, Res = RequestClientResponseData> {
  path: string;
  method: string;
  body?: Body;
  query?: Query;
  headers?: Record<string, string | undefined>;
  response?: RequestClientResponse<Res>;
}
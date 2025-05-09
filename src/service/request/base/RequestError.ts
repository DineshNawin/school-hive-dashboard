import { Request } from './Request';

type ErrorData = string | Record<string, unknown>;

const formatErrorMessage = (
  method: string,
  path: string,
  status: number,
  data?: ErrorData
): string => {
  const base = `Request ${method} ${path} failed with status ${status}`;
  if (!data) return base;

  const details = typeof data === 'string' ? data : JSON.stringify(data);
  return `${base}: ${details}`;
};

export class RequestError<Data extends ErrorData = ErrorData> extends Error {
  constructor(
    public readonly request: Request,
    public readonly status: number,
    public readonly data?: Data
  ) {
    super(formatErrorMessage(request.method, request.path, status, data));
    this.name = 'RequestError';
  }
}

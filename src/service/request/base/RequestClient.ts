import {
  Request,
  RequestClientBody,
  RequestClientQuery,
  RequestClientResponse,
  RequestClientResponseData,
} from './Request';

export interface RequestClient {
  send<B extends RequestClientQuery, Q extends RequestClientBody, R extends RequestClientResponseData>(
    request: Request<B, Q, R>
  ): Promise<RequestClientResponse<R>>;
}
import {
    Request,
    RequestClientBody,
    RequestClientQuery,
    RequestClientResponse,
    RequestClientResponseData,
} from './Request';
import { RequestClient } from './RequestClient';
  import { RequestError } from './RequestError';
  import { AuthTokenStore } from '../../AuthTokenStore';

export class RestApiClient implements RequestClient {
    private readonly token = new AuthTokenStore();
    public async send<
        Body extends RequestClientBody,
        Query extends RequestClientQuery,
        Res extends RequestClientResponseData
    >(request: Request<Body, Query, Res>): Promise<RequestClientResponse<Res>> {
        try {
            const { url, config } = await this.getRequestConfig(request);
            const response = await fetch(url, config);
            const responseData = await this.parseResponse<Res>(response, request);

            return {
                status: response.status,
                headers: this.extractHeaders(response),
                body: responseData,
            };
        } catch (error: unknown) {
            throw error;
        }
    }

    protected async getRequestConfig<Body, Query, Res>(
        request: Request<Body, Query, Res>
    ): Promise<{ url: string; config: RequestInit }> {
        const query = request.query
            ? '?' +
            Object.entries(request.query)
                .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`)
                .join('&')
            : '';

        const baseUrl = process.env.BE_LOCAL_URL;
        const url = `${baseUrl}${request.path}${query}`;

        const token = await this.token.get();

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...request.headers,
        };

        const config: RequestInit = {
            method: request.method,
            headers,
            body: request.body ? JSON.stringify(request.body) : undefined,
        };

        return { url, config };
    }

    protected async parseResponse<T>(response: Response, request:Request): Promise<T> {
        const contentType = response.headers.get('Content-Type');
        if (response.ok) {
            if (contentType?.includes('application/json')) {
                return response.json();
            } else {
                return response.text() as unknown as T;
            }
        } else {
            const errorBody = await (contentType?.includes('application/json')
                ? response.json()
                : response.text());
            throw new RequestError(request, response.status, errorBody);
        }
    }

    protected extractHeaders(response: Response): Record<string, string> {
        const headers: Record<string, string> = {};
        response.headers.forEach((value, key) => {
            headers[key] = value;
        });
        return headers;
    }
}

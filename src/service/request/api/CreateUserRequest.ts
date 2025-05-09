import { Request, RequestClientResponse } from '../base/Request';

type CreateUserBody = {
    username: string;
    password: string;
};

export type CreateUserResponse = {
  token: string;
  errorMessage: string;
};

export class CreateUserRequest implements Request<CreateUserBody, never, CreateUserResponse> {
  public readonly method = 'POST';

  public path;

  public body?: CreateUserBody;

  public response: RequestClientResponse<CreateUserResponse> | undefined;

  constructor(username: string, password: string) {
    this.path = `/api/users/login`;
    this.body = {
      username,
      password
    };
  }
}
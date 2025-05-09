import { CreateUserRequest, CreateUserResponse } from "./request/api/CreateUserRequest";
import { RestApiClient } from "./request/base/RestApiClient";

export class UserService {
  restApiService = new RestApiClient();
  public async createUserRegistration(username: string, password: string):Promise<CreateUserResponse> {
    return await this.restApiService.send(new CreateUserRequest(username, password)).then((response)=>{
      return response.body
      })
      .catch((error) => {
        throw error
      });
  }
}
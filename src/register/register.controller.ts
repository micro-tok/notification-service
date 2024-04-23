import { Controller } from '@nestjs/common';
import { RegisterService } from './register.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @GrpcMethod('NotificationService', 'RegisterToken')
  register(body: { uuid: string; token: string }) {
    return this.registerService.registerToken(body.uuid, body.token);
  }

  @GrpcMethod('NotificationService', 'RemoveToken')
  remove(body: { uuid: string; token: string }) {
    return this.registerService.removeToken(body.uuid, body.token);
  }

  @GrpcMethod('NotificationService', 'RemoveUserTokens')
  removeUserTokens(body: { uuid: string }) {
    return this.registerService.removeUserTokens(body.uuid);
  }

  @GrpcMethod('NotificationService', 'GetUserTokens')
  getUserTokens(body: { uuid: string }) {
    return this.registerService.getUserTokens(body.uuid);
  }

  @GrpcMethod('NotificationService', 'GetAllTokens')
  getAllTokens() {
    return this.registerService.getAllTokens();
  }
}

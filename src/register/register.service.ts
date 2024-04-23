import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RegisterService {
  constructor(private readonly redisService: RedisService) {}

  async registerToken(uuid: string, token: string) {
    await this.redisService.add(uuid, token);
    return {
      uuid,
      token,
    };
  }

  async removeToken(uuid: string, token: string) {
    await this.redisService.del(uuid, token);
    return {
      uuid,
      token,
    };
  }

  async removeUserTokens(uuid: string) {
    await this.redisService.delAll(uuid);
    return {
      uuid,
    };
  }

  async getUserTokens(uuid: string) {
    return await this.redisService.getArray(uuid);
  }

  async getAllTokens() {
    return {
      userTokens: await this.redisService.getAll(),
    };
  }
}

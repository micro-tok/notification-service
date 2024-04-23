import * as redis from 'redis';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client: redis.RedisClientType;

  constructor(private readonly config: ConfigService) {
    this.client = redis.createClient({
      url: this.config.getOrThrow<string>('REDIS_URL'),
      socket: {
        connectTimeout: 5000,
        noDelay: true,
        keepAlive: 1000,
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
      },
      username: this.config.getOrThrow<string>('REDIS_USERNAME'),
      password: this.config.getOrThrow<string>('REDIS_PASSWORD'),
      name: this.config.getOrThrow<string>('REDIS_NAME'),
      database: this.config.get<number>('REDIS_DATABASE', 1),
    });

    this.client.on('error', (error) => {
      console.log('===== Redis error =====');
      console.log(error);
      console.log('===== Redis error =====');
    });

    this.client.on('connect', () => {
      console.log('===== Redis connected =====');
    });
  }

  async onModuleInit() {
    await this.client.connect();
    await this.client.configSet('notify-keyspace-events', 'Ex');
  }

  async onModuleDestroy() {
    await this.client.disconnect();
    console.log('===== Redis disconnected =====');
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async getArray(key: string): Promise<string[]> {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : [];
  }

  async set(key: string, value: string[]): Promise<void> {
    const redisValue = JSON.stringify(value);
    await this.client.set(key, redisValue);
  }

  async add(key: string, value: string): Promise<void> {
    const current = await this.client.get(key);
    if (current) {
      await this.set(key, [...current, value]);
    } else {
      await this.set(key, [value]);
    }
  }

  async del(key: string, value: string): Promise<void> {
    const current = await this.client.get(key);
    if (current) {
      const currentArray = JSON.parse(current);
      const newValue = currentArray.filter((v) => v !== value);

      if (newValue.length) {
        await this.set(key, newValue);
      } else {
        await this.delAll(key);
      }
    }
  }

  async delAll(key: string): Promise<void> {
    await this.client.del(key);
  }

  async getAll() {
    const keys = await this.client.keys('*');

    return Promise.all(
      keys.map(async (key) => ({
        uuid: key,
        tokens: await this.getArray(key),
      })),
    );
  }
}

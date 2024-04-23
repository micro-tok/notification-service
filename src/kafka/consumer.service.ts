import {
  Injectable,
  OnApplicationShutdown,
  OnModuleDestroy,
} from '@nestjs/common';
import {
  Consumer,
  ConsumerRunConfig,
  ConsumerSubscribeTopics,
  Kafka,
} from 'kafkajs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConsumerService implements OnApplicationShutdown, OnModuleDestroy {
  constructor(private readonly configService: ConfigService) {}

  private readonly kafka = new Kafka({
    brokers: [this.configService.getOrThrow('KAFKA_URL')],
    sasl: {
      mechanism: 'scram-sha-512',
      username: this.configService.getOrThrow('KAFKA_USERNAME'),
      password: this.configService.getOrThrow('KAFKA_PASSWORD'),
    },
    ssl: true,
  });
  private readonly consumers: Consumer[] = [];

  async consume(topics: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    const consumer = this.kafka.consumer({
      groupId: this.configService.getOrThrow('KAFKA_GROUP_ID'),
    });
    await consumer.connect();
    await consumer.subscribe(topics);
    await consumer.run(config);
    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
    await Promise.all(this.consumers.map((consumer) => consumer.disconnect()));
  }

  async onModuleDestroy() {
    await Promise.all(this.consumers.map((consumer) => consumer.disconnect()));
  }
}

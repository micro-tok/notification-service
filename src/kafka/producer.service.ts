import {
  Injectable,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, ProducerRecord } from 'kafkajs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProducerService
  implements OnModuleInit, OnApplicationShutdown, OnModuleDestroy
{
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
  private readonly producer = this.kafka.producer();

  async onModuleInit() {
    await this.producer.connect();
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async produce(record: ProducerRecord) {
    await this.producer.send(record);
  }
}

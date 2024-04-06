import {
  Injectable,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, ProducerRecord } from 'kafkajs';

@Injectable()
export class ProducerService
  implements OnModuleInit, OnApplicationShutdown, OnModuleDestroy
{
  private readonly kafka = new Kafka({
    brokers: ['192.168.1.215:9092'],
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

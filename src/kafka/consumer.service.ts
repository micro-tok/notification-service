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

@Injectable()
export class ConsumerService implements OnApplicationShutdown, OnModuleDestroy {
  private readonly kafka = new Kafka({
    brokers: ['192.168.1.215:9092'],
  });
  private readonly consumers: Consumer[] = [];

  async consume(topics: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    const consumer = this.kafka.consumer({ groupId: 'notification-service' });
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

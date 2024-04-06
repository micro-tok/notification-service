import { Injectable } from '@nestjs/common';
import { ProducerService } from './kafka/producer.service';
import { ConsumerService } from './kafka/consumer.service';

@Injectable()
export class AppService {
  constructor(
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
  ) {}

  async getHello() {
    await this.producerService.produce({
      topic: 'notification-service',
      messages: [{ value: 'Hello KafkaJS consumer!' }],
    });
    return 'Hello World!';
  }
}

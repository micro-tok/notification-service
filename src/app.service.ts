import { Injectable } from '@nestjs/common';
import { ProducerService } from './kafka/producer.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private readonly producerService: ProducerService,
    private readonly configService: ConfigService,
  ) {}

  async getHello() {
    await this.producerService.produce({
      topic: this.configService.get('KAFKA_TOPIC'),
      messages: [{ value: 'Hello KafkaJS consumer!' }],
    });
    return 'Hello World!';
  }
}

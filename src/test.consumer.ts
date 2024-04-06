import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './kafka/consumer.service';

@Injectable()
export class TestConsumer implements OnModuleInit {
  constructor(private readonly consumerService: ConsumerService) {}

  async onModuleInit() {
    console.log('TestConsumer initialized');
    await this.consumerService.consume(
      {
        topics: ['notification-service'],
        fromBeginning: true,
      },
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log('Received message:', {
            topic,
            partition,
            value: JSON.parse(message.value.toString()),
          });
        },
      },
    );
  }
}

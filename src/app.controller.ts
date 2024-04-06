import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ProducerService } from './kafka/producer.service';

@Controller()
export class AppController {
  constructor(private readonly producerService: ProducerService) {}

  @Get()
  async getHello() {
    const msg = {
      from_user: 'uuid',
      to_user: 'uuid',
      action: 'like',
      post_id: 'uuid',
    };

    return this.producerService.produce({
      topic: 'notification-service',
      messages: [
        {
          value: JSON.stringify(msg),
        },
      ],
    });
  }
}

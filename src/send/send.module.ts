import { Module } from '@nestjs/common';
import { SendService } from './send.service';
import { RegisterModule } from '../register/register.module';
import { KafkaModule } from '../kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [RegisterModule, KafkaModule, ConfigModule.forRoot()],
  providers: [SendService],
  exports: [SendService],
})
export class SendModule {}

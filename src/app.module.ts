import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { RegisterModule } from './register/register.module';
import { SendService } from './send/send.service';
import { SendModule } from './send/send.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [KafkaModule, RegisterModule, SendModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, SendService],
})
export class AppModule {}

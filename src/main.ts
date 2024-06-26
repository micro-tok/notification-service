import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'notification',
        url: 'localhost:50005',
        protoPath: join(__dirname, '../pb/notification.proto'),
      },
      logger: ['error', 'warn'],
    },
  );

  await app.listen();
}

bootstrap();

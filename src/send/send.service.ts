import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '../kafka/consumer.service';
import { KafkaMessage } from 'kafkajs';
import * as path from 'path';
import * as firebase from 'firebase-admin';
import { RegisterService } from '../register/register.service';
import { ConfigService } from '@nestjs/config';

firebase.initializeApp({
  credential: firebase.credential.cert(
    path.join(__dirname, '../../firebase-adminsdk.json'),
  ),
});

@Injectable()
export class SendService implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly registerService: RegisterService,
    private readonly configService: ConfigService,
  ) {}

  private handleAction(action) {
    switch (action) {
      case 'LIKED':
        return 'Someone liked your post';
      case 'COMMENTED':
        return 'Someone commented on your post';
    }
  }

  private async handleNotification({
    topic,
    partition,
    message,
  }: {
    topic: string;
    partition: number;
    message: KafkaMessage;
  }) {
    console.log('Received message:', {
      topic,
      partition,
      value: JSON.parse(message.value.toString()),
    });

    const { uuid, action } = JSON.parse(message.value.toString());

    try {
      const tokens = await this.registerService.getUserTokens(uuid);

      for (const token of tokens) {
        await firebase
          .messaging()
          .send({
            notification: {
              title: this.handleAction(action),
              body: this.handleAction(action),
            },
            token: token,
          })
          .catch((error: any) => {
            //   if FirebaseMessagingError: Requested entity was not found. - remove token
            if (
              error.errorInfo.code === 'messaging/invalid-registration-token' ||
              error.errorInfo.code ===
                'messaging/registration-token-not-registered'
            ) {
              console.log('Removing token:', token);
              this.registerService.removeToken(uuid, token);
            }
            console.error('Error sending message:', error);
          });
      }
    } catch (error) {
      return error;
    }
  }

  async onModuleInit() {
    await this.consumerService.consume(
      {
        topics: [this.configService.getOrThrow('KAFKA_TOPIC')],
        fromBeginning: false,
      },
      {
        eachMessage: async (msgPayload) => {
          await this.handleNotification(msgPayload);
        },
      },
    );
  }
}

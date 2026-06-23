import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  AUTH_SERVICE,
  PRODUCTIVITY_SERVICE,
  SUBSCRIPTION_SERVICE,
} from '@app/common';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('AUTH_SERVICE_HOST', 'localhost'),
            port: config.get<number>('AUTH_SERVICE_PORT', 4001),
          },
        }),
      },
      {
        name: SUBSCRIPTION_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('SUBSCRIPTION_SERVICE_HOST', 'localhost'),
            port: config.get<number>('SUBSCRIPTION_SERVICE_PORT', 4002),
          },
        }),
      },
      {
        name: PRODUCTIVITY_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('PRODUCTIVITY_SERVICE_HOST', 'localhost'),
            port: config.get<number>('PRODUCTIVITY_SERVICE_PORT', 4003),
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class ClientsProxyModule {}

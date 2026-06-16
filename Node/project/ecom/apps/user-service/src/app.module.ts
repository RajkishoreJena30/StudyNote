import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  HealthController,
  KafkaModule,
  RedisModule,
  configuration,
} from '@app/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    KafkaModule,
    RedisModule,
  ],
  controllers: [HealthController, UsersController],
  providers: [PrismaService, UsersService],
})
export class AppModule {}

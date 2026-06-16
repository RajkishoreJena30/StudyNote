import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './redis.service';
import { LockService } from '../locking/lock.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [RedisService, LockService],
  exports: [RedisService, LockService],
})
export class RedisModule {}

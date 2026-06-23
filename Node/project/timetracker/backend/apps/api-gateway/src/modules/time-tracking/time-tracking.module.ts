import { Module } from '@nestjs/common';
import { TimeTrackingController } from './time-tracking.controller';

@Module({ controllers: [TimeTrackingController] })
export class TimeTrackingModule {}

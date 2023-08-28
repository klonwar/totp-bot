import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { BotModule } from '../bot/bot.module';
import { PageModule } from '../page/page.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageJob } from '../model/page-job/page-job.model';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BotModule,
    PageModule,
    TypeOrmModule.forFeature([PageJob]),
  ],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}

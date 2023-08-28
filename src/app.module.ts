import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CronModule } from './cron/cron.module';
import { BotModule } from './bot/bot.module';
import { PageModule } from './page/page.module';
import { AppUpdate } from './app.update';
import { PageJob } from './model/page-job/page-job.model';
import { User } from './model/user/user.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './db.sqlite',
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([User, PageJob]),
    BotModule,
    CronModule,
    PageModule,
  ],
  providers: [AppUpdate],
})
export class AppModule {}

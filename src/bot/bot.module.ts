import { Logger, Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { session } from 'telegraf';
import { ScenesModule } from './scenes/scenes.module';
import { BotService } from './bot.service';
import { User } from '../model/user/user.model';
import { MessageService } from './message.service';
import * as TelegrafLogger from 'telegraf-logger';

@Module({
  imports: [
    HttpModule,
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_TOKEN'),
        middlewares: [
          session(),
          (() => {
            const nestLogger = new Logger(TelegrafLogger.name);
            return new TelegrafLogger({
              log: (message) => nestLogger.verbose(message),
            }).middleware();
          })(),
        ],
      }),
    }),
    TypeOrmModule.forFeature([User]),
    ScenesModule,
  ],
  controllers: [],
  providers: [BotService, MessageService],
  exports: [ScenesModule, BotService],
})
export class BotModule {}

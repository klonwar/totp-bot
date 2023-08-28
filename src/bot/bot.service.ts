import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { User } from '../model/user/user.model';
import { Telegraf } from 'telegraf';
import { MessageService } from './message.service';
import { ConfigService } from '@nestjs/config';
import * as totp from 'totp-generator';

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);

  constructor(
    private messageService: MessageService,
    private configService: ConfigService,
    @InjectBot() private bot: Telegraf<SceneContext>,
  ) {}

  async generate(user: User) {
    const token = totp(user.secret);
    const expires = 30 - (Math.round(new Date().getTime() / 1000) % 30);

    await this.bot.telegram.sendMessage(
      user.id,
      await this.messageService.generateTemplate(token, expires),
      {
        parse_mode: 'MarkdownV2',
      },
    );
    this.logger.log(`@${user.username ?? user.id} notified`);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../model/user/user.model';
import { Repository } from 'typeorm';
import { Telegraf } from 'telegraf';
import { MessageService } from './message.service';
import { ConfigService } from '@nestjs/config';
import { PageJob } from '../model/page-job/page-job.model';

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);

  constructor(
    private messageService: MessageService,
    private configService: ConfigService,
    @InjectBot() private bot: Telegraf<SceneContext>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(PageJob) private pageJobRepository: Repository<PageJob>,
  ) {}

  async notify(pageJob: PageJob) {
    const user = pageJob.user;

    await this.bot.telegram.sendMessage(
      user.id,
      await this.messageService.notifyTemplate(pageJob),
    );
    this.logger.log(`@${user.username ?? user.id} notified`);
  }
}

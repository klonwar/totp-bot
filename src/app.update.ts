import {
  Command,
  Ctx,
  InjectBot,
  Message,
  Sender,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Injectable, UseFilters } from '@nestjs/common';
import { User } from './model/user/user.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SceneContext } from 'telegraf/typings/scenes';
import { BotScene } from './bot/scenes/scenes.constants';
import { BotService } from './bot/bot.service';
import { Telegraf } from 'telegraf';
import { User as TelegramUser } from 'typegram';
import { AvailableCommands, myCommands } from './bot/bot.constants';
import { AnyExceptionFilter } from './bot/filters/any-exception.filter';
import { PageJob } from './model/page-job/page-job.model';
import { CommandBodyPipe } from './bot/pipes/command-body.pipe';
import { CronService } from './cron/cron.service';
import { TypeExceptionFilter } from './bot/filters/type-exception.filter';

@Update()
@Injectable()
export class AppUpdate {
  constructor(
    @InjectBot() private bot: Telegraf<SceneContext>,
    private botService: BotService,
    private cronService: CronService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(PageJob)
    private pageJobRepository: Repository<PageJob>,
  ) {
    bot.telegram.setMyCommands(myCommands);
  }

  @Start()
  @UseFilters(AnyExceptionFilter)
  async start(@Ctx() context: SceneContext) {
    await context.scene.enter(BotScene.REGISTRATION);
  }

  @Command(AvailableCommands.CREATE)
  @UseFilters(AnyExceptionFilter, TypeExceptionFilter)
  async create(
    @Ctx() context: SceneContext,
    @Sender() sender: TelegramUser,
    @Message('text', CommandBodyPipe) body: string,
  ) {
    const user = await this.userRepository.findOneBy({ id: sender.id });
    const url = new URL(body);

    if (
      await this.pageJobRepository.exist({
        where: { user: { id: sender.id }, url: url.href },
      })
    ) {
      await context.reply(
        'This URL is already being monitored. Delete an existing job or select a different URL',
      );
      return;
    }

    const pageJob = new PageJob();
    pageJob.user = user;
    pageJob.url = url.href;
    await pageJob.save();

    await this.cronService.start(pageJob);

    await context.reply('Job successfully started. Wait for the notification');
  }

  @Command(AvailableCommands.DELETE)
  @UseFilters(AnyExceptionFilter, TypeExceptionFilter)
  async delete(
    @Ctx() context: SceneContext,
    @Sender() sender: TelegramUser,
    @Message('text', CommandBodyPipe) body: string,
  ) {
    const url = new URL(body);
    const pageJob = await this.pageJobRepository.findOneBy({
      user: { id: sender.id },
      url: url.href,
    });

    if (!pageJob) {
      await context.reply('No such URL');
      return;
    }

    this.cronService.stop(pageJob);

    await pageJob.remove();

    await context.reply('Job successfully removed');
  }
}

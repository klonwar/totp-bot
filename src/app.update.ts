import {
  Command,
  Ctx,
  InjectBot,
  Sender,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Injectable, UseFilters, UseGuards } from '@nestjs/common';
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
import { WithSecretGuard } from './bot/guards/with-secret.guard';
import { GuardExceptionFilter } from './bot/filters/guard-exception.filter';

@Update()
@Injectable()
export class AppUpdate {
  constructor(
    @InjectBot() private bot: Telegraf<SceneContext>,
    private botService: BotService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    bot.telegram.setMyCommands(myCommands);
  }

  @Start()
  @UseFilters(AnyExceptionFilter)
  async start(@Ctx() context: SceneContext) {
    await context.scene.enter(BotScene.REGISTRATION);
  }

  @Command(AvailableCommands.GENERATE)
  @UseFilters(AnyExceptionFilter, GuardExceptionFilter)
  @UseGuards(WithSecretGuard)
  async create(@Ctx() context: SceneContext, @Sender() sender: TelegramUser) {
    const user = await this.userRepository.findOneBy({ id: sender.id });
    await this.botService.generate(user);
  }
}

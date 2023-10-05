import {
  Ctx,
  Hears,
  Message,
  Scene,
  SceneEnter,
  SceneLeave,
  Sender,
} from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { BotScene } from '../scenes.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../model/user/user.model';
import { Repository } from 'typeorm';
import { Logger, UseFilters } from '@nestjs/common';
import { AnyExceptionFilter } from '../../filters/any-exception.filter';
import { ConfigService } from '@nestjs/config';
import { User as TelegramUser } from 'typegram/manage';

@Scene(BotScene.REGISTRATION)
export class RegistrationScene {
  private readonly logger = new Logger(RegistrationScene.name);

  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @SceneEnter()
  @UseFilters(AnyExceptionFilter)
  async enter(@Ctx() context: SceneContext) {
    await this.registerUser(context);
    await context.reply('Enter your secret TOTP code');
  }

  @Hears(/^([A-Za-z2-7=]{8})+$/)
  @UseFilters(AnyExceptionFilter)
  async id(
    @Ctx() context: SceneContext,
    @Message('text') secret: string,
    @Sender() sender: TelegramUser,
  ) {
    const user = await this.userRepository.findOneBy({ id: sender.id });
    user.secret = secret;
    await user.save();
    await context.scene.leave();
  }

  @Hears(/.*/)
  @UseFilters(AnyExceptionFilter)
  async wrong(@Ctx() context: SceneContext) {
    await context.reply('Wrong format');
  }

  @SceneLeave()
  @UseFilters(AnyExceptionFilter)
  async leave(@Ctx() context: SceneContext) {
    await context.reply(
      'Saved.\nIn order to change your secret please run /start again',
    );
  }

  private async registerUser(context: SceneContext) {
    const userId = context.from.id;
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      const user = this.userRepository.create({
        ...context.from,
      });
      await this.userRepository.save(user);

      const message = `User @${user.username ?? user.id} registered`;
      this.logger.log(message);
      await context.reply(message);
    }
  }
}

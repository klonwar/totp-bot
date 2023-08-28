import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { BotScene } from '../scenes.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../model/user/user.model';
import { Repository } from 'typeorm';
import { Logger, UseFilters } from '@nestjs/common';
import { AnyExceptionFilter } from '../../filters/any-exception.filter';
import { ConfigService } from '@nestjs/config';

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
    await context.scene.leave();
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

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BotModule } from './bot/bot.module';
import { AppUpdate } from './app.update';
import { User } from './model/user/user.model';
import AppDataSource from '../ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
    }),
    TypeOrmModule.forFeature([User]),
    BotModule,
  ],
  providers: [AppUpdate],
})
export class AppModule {}

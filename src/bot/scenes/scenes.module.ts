import { Module } from '@nestjs/common';
import { RegistrationScene } from './user/registration.scene';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../model/user/user.model';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [RegistrationScene],
})
export class ScenesModule {}

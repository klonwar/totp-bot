import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageJob } from '../model/page-job/page-job.model';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([PageJob])],
  providers: [PageService],
  exports: [PageService],
})
export class PageModule {}

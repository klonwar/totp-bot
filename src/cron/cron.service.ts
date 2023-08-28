import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { BotService } from '../bot/bot.service';
import { ConfigService } from '@nestjs/config';
import { CronJob } from 'cron';
import { PageJob } from '../model/page-job/page-job.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageService } from '../page/page.service';

@Injectable()
export class CronService implements OnModuleInit {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
    private botService: BotService,
    private pageService: PageService,
    @InjectRepository(PageJob)
    private pageJobRepository: Repository<PageJob>,
  ) {}

  async onModuleInit() {
    const pageJobs = await this.pageJobRepository.find();
    await this.start(...pageJobs);
  }

  async start(...pageJobs: PageJob[]) {
    for (const pageJob of pageJobs) {
      await this.tick(pageJob);
      const cronJob = new CronJob(this.configService.get<string>('CRON'), () =>
        this.tick(pageJob),
      );
      this.schedulerRegistry.addCronJob(`` + pageJob.id, cronJob);
      cronJob.start();
    }
    this.logger.log(`Started ${pageJobs.length} jobs`);
  }

  stop(...pageJobs: PageJob[]) {
    pageJobs.forEach((pageJob) => {
      this.schedulerRegistry.deleteCronJob(`` + pageJob.id);
    });
    this.logger.log(`Stopped ${pageJobs.length} jobs`);
  }

  private async tick(pageJob: PageJob) {
    const changed = await this.pageService.check(pageJob);
    if (changed) {
      await this.botService.notify(pageJob);
    }
  }
}

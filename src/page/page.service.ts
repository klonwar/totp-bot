import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PageJob } from '../model/page-job/page-job.model';
import { Repository } from 'typeorm';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { createHash } from 'crypto';

@Injectable()
export class PageService {
  private readonly logger = new Logger(PageService.name);

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    @InjectRepository(PageJob)
    private pageJobRepository: Repository<PageJob>,
  ) {}

  public async check(pageJob: PageJob) {
    const hash = await this.request(pageJob);
    const changed = pageJob.hash !== hash;

    pageJob.hash = hash;
    await pageJob.save();

    this.logger.log(
      `Url ${pageJob.url} content ${changed ? 'changed' : 'not changed'}`,
    );

    return changed;
  }

  private async request(pageJob: PageJob) {
    return firstValueFrom(
      this.httpService.get(pageJob.url).pipe(
        map((res) => this.hash(res.data)),
        catchError((e) => {
          this.logger.error(e);
          return of(null);
        }),
      ),
    );
  }

  private async hash(text: string) {
    return createHash('sha1').update(text).digest('base64');
  }
}

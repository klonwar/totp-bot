import { Injectable } from '@nestjs/common';
import { User } from '../model/user/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageJob } from '../model/page-job/page-job.model';
import * as moment from 'moment/moment';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(PageJob) private pageJobRepository: Repository<PageJob>,
  ) {}

  public async notifyTemplate(pageJob: PageJob) {
    const url = pageJob.url;
    const updated = moment(pageJob.updated_at).format('HH:mm:SS DD.MM.YYYY');

    const lines = [`📅 Date: ${updated}`, ``, `🔗 URL: ${url}`];

    return this.fromLines(lines);
  }

  private fromParts(parts: string[]) {
    return parts.filter((item) => item !== null).join(` `);
  }

  private fromLines(lines: string[]) {
    return lines.filter((item) => item !== null).join(`\n`);
  }
}

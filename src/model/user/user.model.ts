import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { PageJob } from '../page-job/page-job.model';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column({
    nullable: true,
  })
  username?: string;

  @OneToMany(() => PageJob, (page) => page.user, {
    lazy: true,
  })
  pages: PageJob[];
}

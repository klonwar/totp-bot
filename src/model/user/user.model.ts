import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column({
    nullable: true,
  })
  username?: string;

  @Column({
    nullable: true,
  })
  secret?: string;
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '~modules/users/user.entity';
import { AbstractEntity } from '~common/entities/abstract.entity';

@Entity('uploads')
export class Upload extends AbstractEntity {
  @ManyToOne(() => User, (user) => user.uploads, { nullable: false })
  @JoinColumn()
  user: User;

  @Column({ default: 0, nullable: false, type: 'int' })
  size: number;

  @Column({ default: null, type: 'text' })
  filename: string;

  @Column({ nullable: false, type: 'text' })
  location: string;

  @Column({ default: null, type: 'text' })
  mimetype: string;

  @Column({ default: null, type: 'int' })
  width: number;

  @Column({ default: null, type: 'int' })
  height: number;

  @Column({ default: null, type: 'text' })
  extension: string;

  @Exclude()
  @Column({ default: false })
  canDelete: boolean;

  @Exclude()
  @Column({ default: false })
  deletedFromDisk: boolean;

  @Exclude()
  @Column({ default: null })
  lastDeleteAttemptAt: Date;

  @Exclude()
  @Column({ default: 0 })
  deleteAttemptsCount: number;
}

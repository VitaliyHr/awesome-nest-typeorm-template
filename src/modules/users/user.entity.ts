import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { AbstractEntity } from '~common/entities/abstract.entity';

import { UserRoleEnum } from './enums/user-role.enum';
import { Upload } from '~modules/uploads/upload.entity';

@Entity('users')
export class User extends AbstractEntity {
  @Column({ unique: true, nullable: false })
  email: string;

  @Exclude()
  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true, length: 32 })
  firstName: string;

  @Column({ nullable: true, length: 32 })
  lastName: string;

  @Column({ nullable: true, unique: true })
  phoneNumber: string;

  @OneToOne(() => Upload)
  avatarImage: Upload;

  @Exclude()
  @Column({ nullable: false, type: 'enum', enum: UserRoleEnum })
  role: UserRoleEnum;

  // bi-connections

  @OneToMany(() => Upload, (upload) => upload.user)
  uploads: Upload[];
}

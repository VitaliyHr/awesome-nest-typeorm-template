import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '~common/entities/abstract.entity';

import { TokensTypeEnum } from './enums/tokens-type.enum';
import { TokensStatusEnum } from './enums/tokens-status.enum';

@Entity('tokens')
export class Token extends AbstractEntity {
  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  token: string;

  @Column({ nullable: false, type: 'enum', enum: TokensTypeEnum })
  type: TokensTypeEnum;

  @Column({ nullable: false })
  expireAt: Date;

  @Column({ enum: TokensStatusEnum, default: TokensStatusEnum.NEW, type: 'enum' })
  status: TokensStatusEnum;
}

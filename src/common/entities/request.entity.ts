import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '@app/users/entities/user.entity';

@Entity({ name: 'requests' })
export class RequestEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ default: false })
  public status!: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt!: Date;

  @ManyToOne(() => UserEntity, (user) => user.usersWhoSentRequest)
  firstUser: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.usersWhoReceivedRequest)
  secondUser: UserEntity;
}

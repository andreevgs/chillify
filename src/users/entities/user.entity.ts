import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
import { EventEntity } from '@app/events/entities/event.entity';
import { InvitationEntity } from '@app/common/entities/invitation.entity';
import { ContactEntity } from '@app/common/entities/contact.entity';
import { RequestEntity } from '@app/common/entities/request.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ select: false })
  password: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  @OneToMany(() => EventEntity, (event) => event.creator)
  events: EventEntity[];

  @OneToMany(() => InvitationEntity, (invitation) => invitation.inviter)
  sentInvitations: InvitationEntity[];

  @OneToMany(() => InvitationEntity, (invitation) => invitation.invited)
  receivedInvitations: InvitationEntity[];

  @OneToMany(() => ContactEntity, (contact) => contact.firstUser)
  usersWhoRequested: ContactEntity[];

  @OneToMany(() => ContactEntity, (contact) => contact.secondUser)
  usersWhoAccepted: ContactEntity[];

  @OneToMany(() => RequestEntity, (request) => request.firstUser)
  usersWhoSentRequest: ContactEntity[];

  @OneToMany(() => RequestEntity, (request) => request.secondUser)
  usersWhoReceivedRequest: ContactEntity[];
}

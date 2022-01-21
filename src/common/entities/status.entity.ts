import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { InvitationEntity } from '@app/common/entities/invitation.entity';

@Entity({ name: 'statuses' })
export class StatusEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nameRu: string;

  @OneToMany(() => InvitationEntity, (invitation) => invitation.status)
  invitations: InvitationEntity[];
}

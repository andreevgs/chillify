import {
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { UserEntity } from "@app/users/entities/user.entity";
import { EventEntity } from "@app/events/entities/event.entity";
import { StatusEntity } from "@app/common/entities/status.entity";

@Entity({ name: 'invitations' })
export class InvitationEntity {
    @PrimaryGeneratedColumn()
    public id!: number;

    @CreateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)"
    })
    public createdAt!: Date;

    @UpdateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
        onUpdate: "CURRENT_TIMESTAMP(6)"
    })
    public updatedAt!: Date;

    @ManyToOne(() => EventEntity, event => event.invitations)
    event: EventEntity;

    @ManyToOne(() => UserEntity, user => user.sentInvitations)
    inviter: UserEntity;

    @ManyToOne(() => UserEntity, user => user.receivedInvitations)
    invited: UserEntity;

    @ManyToOne(() => StatusEntity, status => status.invitations)
    status: StatusEntity;
}

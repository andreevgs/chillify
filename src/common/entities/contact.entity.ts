import {
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { UserEntity } from "@app/users/entities/user.entity";

@Entity({ name: 'contacts' })
export class ContactEntity {
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

    @ManyToOne(() => UserEntity, user => user.usersWhoRequested)
    firstUser: UserEntity;

    @ManyToOne(() => UserEntity, user => user.usersWhoAccepted)
    secondUser: UserEntity;
}

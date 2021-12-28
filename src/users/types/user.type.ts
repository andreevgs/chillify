import { UserEntity } from "@app/users/entities/user.entity";

export type UserType = Omit<UserEntity, "hashPassword">;
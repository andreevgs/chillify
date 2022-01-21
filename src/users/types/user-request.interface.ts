import { Request } from 'express';
import { UserEntity } from '@app/users/entities/user.entity';

export interface UserRequestInterface extends Request {
  user?: UserEntity;
}

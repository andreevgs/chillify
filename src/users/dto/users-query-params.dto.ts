import { IsString } from 'class-validator';

export class UsersQueryParamsDto {
  @IsString()
  username: string;
}

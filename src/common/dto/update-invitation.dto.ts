import { IsNotEmpty } from 'class-validator';

export class UpdateInvitationDto {
  @IsNotEmpty()
  readonly statusId: number;
}

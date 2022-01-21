import { IsNotEmpty } from 'class-validator';

export class CreateInvitationDto {
  @IsNotEmpty()
  readonly inviterId: number;

  @IsNotEmpty()
  readonly invitedId: number;

  @IsNotEmpty()
  readonly statusId: number;
}

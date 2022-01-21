import { IsNotEmpty } from 'class-validator';
import { CreateInvitationDto } from '@app/common/dto/create-invitation.dto';

export class CreateEventDto {
  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly date: Date;

  @IsNotEmpty()
  readonly invitations: CreateInvitationDto[];
}

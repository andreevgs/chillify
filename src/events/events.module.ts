import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from '@app/events/entities/event.entity';
import { UserEntity } from '@app/users/entities/user.entity';
import { InvitationEntity } from '@app/common/entities/invitation.entity';
import { StatusEntity } from '@app/common/entities/status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventEntity,
      UserEntity,
      StatusEntity,
      InvitationEntity,
    ]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}

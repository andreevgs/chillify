import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventEntity } from '@app/events/entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRequestInterface } from '@app/users/types/user-request.interface';
import { UserEntity } from '@app/users/entities/user.entity';
import { StatusEntity } from '@app/common/entities/status.entity';
import { InvitationEntity } from '@app/common/entities/invitation.entity';
import { EventResponseInterface } from '@app/events/types/event-response.interface';
import { EventsResponseInterface } from '@app/events/types/events-response.interface';
import { CreateInvitationDto } from '@app/common/dto/create-invitation.dto';
import { UpdateInvitationDto } from '@app/common/dto/update-invitation.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(StatusEntity)
    private readonly statusRepository: Repository<StatusEntity>,
    @InjectRepository(InvitationEntity)
    private readonly invitationRepository: Repository<InvitationEntity>,
  ) {}

  async create(
    @Req() req: UserRequestInterface,
    createEventDto: CreateEventDto,
  ): Promise<EventEntity> {
    const newEvent = new EventEntity();
    newEvent.creator = req.user;
    newEvent.description = createEventDto.description;
    newEvent.date = createEventDto.date;

    const createdEvent = await this.eventRepository.save(newEvent);
    const currentUser = req.user;
    const inviter = await this.userRepository.findOne({
      id: currentUser.id,
    });
    const createdInvitations = await Promise.all(
      createEventDto.invitations.map(
        async (createInvitationDto, index, array) => {
          const invited = await this.userRepository.findOne({
            id: createInvitationDto.invitedId,
          });
          const status = await this.statusRepository.findOne({
            id: createInvitationDto.statusId,
          });

          const newInvitation = new InvitationEntity();
          newInvitation.invited = invited;
          newInvitation.inviter = inviter;
          newInvitation.status = status;
          newInvitation.event = createdEvent;
          return await this.invitationRepository.save(newInvitation);
        },
      ),
    );

    return {
      ...createdEvent,
      invitations: createdInvitations,
    };
  }

  async findAll(@Req() req: UserRequestInterface) {
    return await this.eventRepository.find({ creator: req.user });
  }

  async findOne(
    @Req() req: UserRequestInterface,
    eventId: number,
  ): Promise<EventEntity> {
    const currentUser = req.user;
    const currentEvent = await this.eventRepository.findOne(
      { id: eventId, creator: currentUser },
      {
        loadEagerRelations: true,
        relations: ['creator'],
      },
    );

    if (!currentEvent) {
      throw new HttpException('error', HttpStatus.NOT_FOUND);
    }
    return currentEvent;
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }

  async invite(
    @Req() req: UserRequestInterface,
    createInvitationDto: CreateInvitationDto,
    eventId: number,
  ): Promise<InvitationEntity> {
    const { inviterId, invitedId, statusId } = createInvitationDto; //inviterId можно выкинуть из объекта запроса и брать id из токена
    const currentUser = req.user;
    const currentEvent = await this.eventRepository.findOne(
      { id: eventId },
      { relations: ['creator'] },
    );
    const invitedUser = await this.userRepository.findOne({ id: invitedId });
    const checkInvitationExist = await this.invitationRepository.findOne({
      invited: invitedUser,
    });
    const status = await this.statusRepository.findOne({ id: statusId });

    if (
      !currentEvent ||
      currentEvent.creator.id !== currentUser.id ||
      checkInvitationExist ||
      inviterId !== currentUser.id ||
      !invitedUser
    ) {
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }

    const newInvitation = new InvitationEntity();
    newInvitation.invited = invitedUser;
    newInvitation.inviter = currentUser;
    newInvitation.status = status;
    newInvitation.event = currentEvent;

    return newInvitation;
  }

  async updateInvitation(
    @Req() req: UserRequestInterface,
    updateInvitationDto: UpdateInvitationDto,
    eventId: number,
    inviteId: number,
  ): Promise<InvitationEntity> {
    const currentUser = req.user;
    const { statusId } = updateInvitationDto;
    const targetStatus = await this.statusRepository.findOne({ id: statusId });
    const currentEvent = await this.eventRepository.findOne({ id: eventId });
    const currentInvitation = await this.invitationRepository.findOne(
      {
        id: inviteId,
        event: currentEvent,
      },
      {
        relations: ['event', 'inviter', 'invited', 'status'],
      },
    );
    if (
      !targetStatus ||
      !currentEvent ||
      !currentInvitation ||
      currentUser.id !== currentInvitation?.invited.id ||
      currentUser.id === currentInvitation?.inviter.id
    ) {
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }

    await this.invitationRepository.update(
      { id: currentInvitation.id },
      { status: targetStatus },
    );

    return await this.invitationRepository.findOne(
      {
        id: currentInvitation.id,
      },
      {
        relations: ['event', 'inviter', 'invited', 'status'],
      },
    );
  }

  async findInvitation(
    @Req() req: UserRequestInterface,
    eventId: number,
    inviteId: number,
  ): Promise<InvitationEntity> {
    const currentUser = req.user;
    const currentEvent = await this.eventRepository.findOne({ id: eventId });
    const currentInvitation = await this.invitationRepository.findOne(
      {
        id: inviteId,
        invited: currentUser,
        event: currentEvent,
      },
      {
        relations: ['event', 'inviter', 'invited', 'status'],
      },
    );

    if (!currentInvitation) {
      throw new HttpException('error', HttpStatus.NOT_FOUND);
    }

    return currentInvitation;
  }

  buildEventResponse(event: EventEntity): EventResponseInterface {
    return { event: event };
  }

  buildEventsResponse(events: EventEntity[]): EventsResponseInterface {
    return { events: events };
  }

  buildInvitationResponse(invitation: InvitationEntity) {
    return { invitation: invitation };
  }
}

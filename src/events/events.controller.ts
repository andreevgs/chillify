import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AuthGuard } from '@app/auth/guards/auth.guard';
import { UserRequestInterface } from '@app/users/types/user-request.interface';
import { EventResponseInterface } from '@app/events/types/event-response.interface';
import { EventsResponseInterface } from '@app/events/types/events-response.interface';
import { CreateInvitationDto } from '@app/common/dto/create-invitation.dto';
import { UpdateInvitationDto } from '@app/common/dto/update-invitation.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Req() req: UserRequestInterface,
    @Body('event') createEventDto: CreateEventDto,
  ): Promise<EventResponseInterface> {
    const event = await this.eventsService.create(req, createEventDto);
    return this.eventsService.buildEventResponse(event);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @Req() req: UserRequestInterface,
  ): Promise<EventsResponseInterface> {
    const users = await this.eventsService.findAll(req);
    return this.eventsService.buildEventsResponse(users);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Req() req: UserRequestInterface, @Param('id') id: string) {
    const event = await this.eventsService.findOne(req, +id);
    return this.eventsService.buildEventResponse(event);
  }

  @Post(':id/invite')
  @UseGuards(AuthGuard)
  async invite(
    @Req() req: UserRequestInterface,
    @Body('invitation') createInvitationDto: CreateInvitationDto,
    @Param('id') id: string,
  ) {
    const invitation = await this.eventsService.invite(
      req,
      createInvitationDto,
      +id,
    );
    return this.eventsService.buildInvitationResponse(invitation);
  }

  @Get(':id/invite/:inviteId')
  @UseGuards(AuthGuard)
  async findInvitation(
    @Req() req: UserRequestInterface,
    @Param('id') eventId: string,
    @Param('inviteId') inviteId: string,
  ) {
    const invitation = await this.eventsService.findInvitation(
      req,
      +eventId,
      +inviteId,
    );

    return this.eventsService.buildInvitationResponse(invitation);
  }

  @Patch(':id/invite/:inviteId')
  @UseGuards(AuthGuard)
  async updateInvitation(
    @Req() req: UserRequestInterface,
    @Body('invitation') updateInvitationDto: UpdateInvitationDto,
    @Param('id') id: string,
    @Param('inviteId') inviteId: string,
  ) {
    const invitation = await this.eventsService.updateInvitation(
      req,
      updateInvitationDto,
      +id,
      +inviteId,
    );
    return this.eventsService.buildInvitationResponse(invitation);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(+id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}

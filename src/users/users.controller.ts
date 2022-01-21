import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards, Query
} from "@nestjs/common";
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRequestInterface } from '@app/users/types/user-request.interface';
import { AuthGuard } from '@app/auth/guards/auth.guard';
import { UsersResponseInterface } from '@app/users/types/users-response.interface';
import { UserResponseInterface } from '@app/users/types/user-response.interface';
import { UsersQueryParamsDto } from "@app/users/dto/users-query-params.dto";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  async findAll(
    @Query() usersQueryParamsDto: UsersQueryParamsDto,
  ): Promise<UsersResponseInterface> {
    const users = await this.usersService.findAll(usersQueryParamsDto);
    return this.usersService.buildUsersResponse(users);
  }

  @Get('current')
  @UseGuards(AuthGuard)
  findCurrent(@Req() req: UserRequestInterface): UserResponseInterface {
    const user = this.usersService.findCurrent(req);
    return this.usersService.buildUserResponse(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string): Promise<UserResponseInterface> {
    const user = await this.usersService.findOne(+id);
    return this.usersService.buildUserResponse(user);
  }

  @Patch('current')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete('current')
  removeCurrent(@Param('id') id: string) {
    return this.usersService.removeCurrent(+id);
  }
}

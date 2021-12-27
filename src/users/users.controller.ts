import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('current')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('current')
  findCurrent() {
    return this.usersService.findCurrent();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
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

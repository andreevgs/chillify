import { Injectable, Req } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Like, Repository } from "typeorm";
import { UserEntity } from '@app/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRequestInterface } from '@app/users/types/user-request.interface';
import { UserResponseInterface } from '@app/users/types/user-response.interface';
import { UsersResponseInterface } from '@app/users/types/users-response.interface';
import { UsersQueryParamsDto } from "@app/users/dto/users-query-params.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  findCurrent(@Req() req: UserRequestInterface): UserEntity {
    return req.user;
  }

  async findAll(
    userQueryParamsDto: UsersQueryParamsDto,
  ): Promise<UserEntity[]> {
    const { username } = userQueryParamsDto;
    const searchOptions = username ? { username: Like(`%${username}%`) } : null;
    return await this.userRepository.find(searchOptions);
  }

  async findOne(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({ id: id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  removeCurrent(id: number) {
    return `This action removes a #${id} user`;
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return { user: user };
  }

  buildUsersResponse(users: UserEntity[]): UsersResponseInterface {
    return { users: users };
  }
}

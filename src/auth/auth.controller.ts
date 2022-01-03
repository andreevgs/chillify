import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from "@app/users/dto/create-user.dto";
import { LoginUserDto } from "@app/users/dto/login-user.dto";
import { UserEntity } from "@app/users/entities/user.entity";
import {AccessTokenInterface} from "@app/auth/types/access-token.interface";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async create(
      @Body('user') createUserDto: CreateUserDto
  ) : Promise<UserEntity> {
    return await this.authService.createUser(createUserDto);
  }

  @Post('signin')
  async login(
      @Body('user') loginUserDto: LoginUserDto
  ) : Promise<AccessTokenInterface> {
    return await this.authService.login(loginUserDto);
  }
}

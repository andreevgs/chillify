import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@app/users/dto/create-user.dto';
import { LoginUserDto } from '@app/users/dto/login-user.dto';
import { AccessTokenInterface } from '@app/auth/types/access-token.interface';
import { UsersService } from '@app/users/users.service';
import { UserResponseInterface } from '@app/users/types/user-response.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('signup')
  async create(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.authService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async login(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<AccessTokenInterface> {
    return await this.authService.login(loginUserDto);
  }
}

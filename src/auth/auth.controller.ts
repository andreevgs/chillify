import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@app/users/dto/create-user.dto';
import { LoginUserDto } from "@app/users/dto/login-user.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('signin')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(LoginUserDto);
  }
}

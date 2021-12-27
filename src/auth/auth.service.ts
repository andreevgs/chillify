import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@app/users/dto/create-user.dto';
import { LoginUserDto } from "@app/users/dto/login-user.dto";

@Injectable()
export class AuthService {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new auth';
  }

  login(loginUserDto: LoginUserDto) {
    return 'This is login';
  }
}

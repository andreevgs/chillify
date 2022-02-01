import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@app/users/dto/create-user.dto';
import { LoginUserDto } from '@app/users/dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/users/entities/user.entity';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { AccessTokenInterface } from '@app/auth/types/access-token.interface';
import { JWT_SECRET } from '@app/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const errorResponse = {
      errors: {},
    };
    const userByEmail = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    const userByUsername = await this.userRepository.findOne({
      username: createUserDto.username,
    });

    if (userByEmail) {
      errorResponse.errors['email'] = 'has already been taken';
    }

    if (userByUsername) {
      errorResponse.errors['username'] = 'has already been taken';
    }
    if (userByEmail || userByUsername) {
      throw new HttpException(errorResponse, HttpStatus.FORBIDDEN);
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  async login(loginUserDto: LoginUserDto): Promise<AccessTokenInterface> {
    const errorResponse = {
      errors: {
        'email or password': 'is invalid',
      },
    };

    const user = await this.userRepository.findOne(
      {
        email: loginUserDto.email,
      },
      {
        select: [
          'id',
          'username',
          'email',
          'firstName',
          'lastName',
          'password',
        ],
      },
    );

    if (!user) {
      throw new HttpException(errorResponse, HttpStatus.FORBIDDEN);
    }

    const isPasswordCorrect = await compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(errorResponse, HttpStatus.FORBIDDEN);
    }

    delete user.password;
    return {
      accessToken: this.generateAccessToken(user),
    };
  }

  generateAccessToken(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
    );
  }
}

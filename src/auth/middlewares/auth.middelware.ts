import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UserRequestInterface } from '@app/users/types/user-request.interface';
import { UsersService } from '@app/users/users.service';
import { JWT_SECRET } from "@app/config";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}

  async use(req: UserRequestInterface, _: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const decode = verify(token, JWT_SECRET);
      const currentUser = await this.userService.findOne(decode['id']);
      req.user = currentUser;
      next();
    } catch (err) {
      req.user = null;
      next();
    }
  }
}

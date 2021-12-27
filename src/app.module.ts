import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AccountModule } from './account/account.module';
import { EventsModule } from './events/events.module';
import ormconfig from "@app/ormconfig";

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), AuthModule, UsersModule, AccountModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

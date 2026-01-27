import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt.auth.guard';

@Module({
  imports: [UsersModule],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}

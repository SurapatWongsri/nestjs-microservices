import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserContext } from './auth.types';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: UserContext }>();
    return request.user;
  },
);

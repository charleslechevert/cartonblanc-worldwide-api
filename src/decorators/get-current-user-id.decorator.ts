import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../types';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    console.log(request.user);
    const team = request.user as JwtPayload;
    return team.sub;
  },
);

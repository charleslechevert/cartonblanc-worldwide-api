import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { AtGuard } from './at.guard';

@Injectable()
export class TeamGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const team_id = Number(request.params.team_id);

    // Allow access if the team_id is 12071998
    if (team_id === 12071998) {
      return true;
    }

    return false;
  }
}

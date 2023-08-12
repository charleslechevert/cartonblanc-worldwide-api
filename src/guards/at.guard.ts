import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';

const DEMO_TEAM_ID = '12071998';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    let canActivate: any;
    let demoMode = false;

    try {
      canActivate = await super.canActivate(context);
    } catch (error) {
      console.warn('JWT Error:', error.message); // Logging the error for traceability
      demoMode = true;
      canActivate = true; // Set canActivate to true so the guard doesn't block the request
    }

    const request = context.switchToHttp().getRequest();
    if (demoMode) {
      // In case of demo mode, override the teamId
      request.user = { sub: DEMO_TEAM_ID };
      request.params.team_id = DEMO_TEAM_ID;
    } else {
      const teamIdInRoute = request.params.team_id;
      const teamIdInToken = request.user?.sub;

      if (teamIdInRoute != teamIdInToken) {
        throw new UnauthorizedException(
          'Team ID mismatch between token and route',
        );
      }
    }

    return canActivate;
  }
}

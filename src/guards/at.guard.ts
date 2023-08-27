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

    const request = context.switchToHttp().getRequest();

    let isJwtError = false;
    try {
      await super.canActivate(context);
    } catch (error) {
      console.warn('JWT Error:', error.message);
      isJwtError = true;
    }

    if (isJwtError || this.isDemoMode(request)) {
      // Block modifying methods for demo mode
      if (this.isModifyingMethod(request)) {
        throw new UnauthorizedException('Modifying demo data is not allowed');
      }

      // Block logout route for demo mode
      if (this.isLogoutRoute(request)) {
        throw new UnauthorizedException('Cannot logout the demo team');
      }

      // Override to demo mode if JWT error or demo team ID
      request.user = { sub: DEMO_TEAM_ID };
      request.params.team_id = DEMO_TEAM_ID;
    } else {
      // Additional checks or operations for authenticated users can go here
      const teamIdInRoute = request.params.team_id;
      const teamIdInToken = request.user?.sub;

      if (teamIdInRoute != teamIdInToken) {
        //!\\ Types between two values are different
        request.user = { sub: DEMO_TEAM_ID };
        request.params.team_id = DEMO_TEAM_ID;
      }
    }

    return true; // If none of the conditions block the request, allow it
  }

  private isModifyingMethod(request): boolean {
    const disallowedMethods = ['POST', 'PUT', 'DELETE'];
    return disallowedMethods.includes(request.method);
  }

  private isDemoMode(request): boolean {
    return request.params.team_id === DEMO_TEAM_ID;
  }

  private isLogoutRoute(request): boolean {
    return request.route.path.includes('/team/logout/');
  }
}

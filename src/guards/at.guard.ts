import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs'; // Import this helper if the return value is an Observable

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

    // Special handling for the demo team ID
    const request = context.switchToHttp().getRequest();
    const team_id = Number(request.params.team_id);
    if (team_id === 12071998) {
      return true;
    }

    if (isPublic) return true;

    // If super.canActivate returns an Observable, you may need to convert it to a Promise
    const canActivateResult = super.canActivate(context);
    if (canActivateResult instanceof Observable) {
      return firstValueFrom(canActivateResult);
    }

    return canActivateResult;
  }
}

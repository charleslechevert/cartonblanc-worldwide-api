// demo-data.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(UnauthorizedException)
export class DemoDataFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (request.method === 'GET') {
      // Check the URL to determine the appropriate demo data to send
      if (request.url.includes('penalty')) {
        response.json({
          /* penalty demo data */
        });
      } else if (request.url.includes('player')) {
        response.json({
          /* player demo data */
        });
      } else {
        // Handle other routes or send a generic response
        response.json({ message: 'Demo data' });
      }
    } else {
      // For non-GET requests, you might want to send an actual unauthorized error or handle differently
      response.status(401).json({ message: 'Unauthorized' });
    }
  }
}

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'SECRET_KEY';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // attach payload to request
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

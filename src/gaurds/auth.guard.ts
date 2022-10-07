import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export class AuthGaurd implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};
    if (userId) {
      return true;
    } else {
      throw new HttpException(
        'Please signin as a superuser',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}

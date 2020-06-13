import { BadGatewayException, BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SanitizedResponse } from '../classes';

interface IRedtailResponse {
  data: any;
}

@Injectable()
export class RedtailHttpInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle()
    .pipe(
      map((data: IRedtailResponse) => {
        return new SanitizedResponse(data.data);
      }),
      catchError((error: AxiosError) => {
        switch (error.response.status) {
          case 400:
            return throwError(new BadRequestException(error.response.statusText));
          case 401:
            return throwError(new UnauthorizedException(error.response.statusText));
          case 404:
            return throwError(new NotFoundException(error.response.statusText));
          default:
            return throwError(new BadGatewayException);
        }
      })
    );
  }
}

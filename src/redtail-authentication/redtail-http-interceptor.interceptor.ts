import { BadGatewayException, BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SanitizedResponse } from '../classes';

interface IRedtailResponse {
  data: any;
}

interface IRedtailError extends AxiosError {
  response: IRedtailErrorResponse;
}

interface IRedtailErrorResponse extends AxiosResponse {
  statusCode?: number;
  message?: object[];
}

@Injectable()
export class RedtailHttpInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle()
    .pipe(
      map((data: IRedtailResponse) => {
        return new SanitizedResponse(data.data);
      }),
      catchError((error: IRedtailError) => {
        switch (error.response.status || error.response.statusCode) {
          case 400:
            return throwError(new BadRequestException(error.response.statusText || error.response.message));
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

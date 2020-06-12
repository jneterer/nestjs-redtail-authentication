import { BadGatewayException, BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface IRedtailResponse extends AxiosResponse {
  data: any;
}

@Injectable()
export class RedtailHttpInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle()
    .pipe(
      map((data: IRedtailResponse) => { return data.data }),
      catchError((error: AxiosError) => {
        switch (error.response.status) {
          case 400:
            return throwError(new BadRequestException(error.response.statusText));
          case 404:
            return throwError(new NotFoundException(error.response.statusText));
          default:
            return throwError(new BadGatewayException);
        }
      })
    );
  }
}

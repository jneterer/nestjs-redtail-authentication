import { HttpService, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AxiosError } from 'axios';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IAuthKeys, IAuthResponse, IResponse } from '../interfaces';
import { MODULE_CONFIG, RedtailAuthenticationConfig } from './config';
import { UtilsService } from './utils.service';

/**
 * Useful service
 */
@Injectable()
export class RedtailAuthenticationService {

  /**
   * Creates a new `LibraryNameService`
   * @param config Provided configuration
   */
  constructor(@Inject(MODULE_CONFIG) private config: RedtailAuthenticationConfig,
              private httpService: HttpService,
              private jwtService: JwtService,
              private utilsService: UtilsService) {}

  /**
   * Logs the user in given their username and password.
   * @param {string} username
   * @param {string} password
   * @returns {Observable<IAuthKeys>}
   */
  login(username: string, password: string): Observable<IAuthKeys> {
    return <Observable<IAuthKeys>>this.httpService.get(`${this.config.REDTAIL_BASE_URL}/authentication`, {
      headers: {
        Authorization: `Basic ${this.utilsService.getBase64(`${this.config.REDTAIL_API_KEY}:${username}:${password}`)}`,
        ['Content-Type']: 'application/json'
      }
    }).pipe(map((response: IAuthResponse) => {
      const access_token: string = this.jwtService.sign({
        username: username,
        sub: response.data.UserKey
      }, {
        expiresIn: this.config.JWT_ACCESS_TOKEN_EXPIRES
      });
      const refresh_token: string = this.jwtService.sign({
        username: username,
        sub: access_token
      }, {
        expiresIn: this.config.JWT_REFRESH_TOKEN_EXPIRES
      });
      // const encrypted: string = this.encrypt(access_token);
      // const decrypted: string = this.decrypt(encrypted);
      return { access_token: access_token, refresh_token: refresh_token };
    }), catchError((error: AxiosError) => {
      return of({
        statusCode: error.response.status,
        message: error.response.statusText
      });
    }));
  }

  /**
   * Determines if the user is authenticated.
   * @param {IAuthKeys} cookies 
   * @returns {Observable<IResponse>}
   */
  authenticated(cookies: IAuthKeys): Observable<IResponse> {
    return <Observable<IResponse>>this.httpService.get(`${this.config.REDTAIL_BASE_URL}/authentication`, this.utilsService.getHeaders(cookies))
    .pipe(
      map((response: IAuthResponse) => {
        return {
          statusCode: 200,
          message: true
        }
      }),
      catchError((error: AxiosError) => {
        return throwError(new UnauthorizedException(error.response.statusText));
    }));
  }

}
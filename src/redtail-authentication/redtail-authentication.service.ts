import { HttpService, Inject, Injectable, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AxiosError } from 'axios';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IAuthKeys, IAuthResponse, IResponse } from '../interfaces';
import { UtilsService } from './utils.service';
import { MODULE_CONFIG, RedtailAuthenticationConfig } from './config';

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
   * @param {Req} req 
   * @returns {Observable<IResponse>}
   */
  authenticated(@Req() req): Observable<IResponse> {
    return <Observable<IResponse>>this.httpService.get(`${this.config.REDTAIL_BASE_URL}/authentication`, this.utilsService.getHeaders(req))
    .pipe(
      map((response: IAuthResponse) => {
        return {
          statusCode: 200,
          message: true
        }
      }),
      catchError((error: AxiosError) => {
      return of({
        statusCode: error.response.status,
        message: error.response.statusText
      });
    }));
  }

}
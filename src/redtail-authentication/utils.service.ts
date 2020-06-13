import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AxiosRequestConfig } from 'axios';
import { IAuthKeys, IJwtUserVerification } from '../interfaces';
import { MODULE_CONFIG, RedtailAuthenticationConfig } from './config';

@Injectable()
export class UtilsService {

  constructor(@Inject(MODULE_CONFIG) private config: RedtailAuthenticationConfig,
              private jwtService: JwtService) {}

  /**
   * Creates the headers for the redtail request given the cookies.
   * @param {IAuthKeys} cookies 
   * @returns {AxiosRequestConfig}
   */
  getHeaders(cookies: IAuthKeys): AxiosRequestConfig {
    // DECODE JWT
    const access_token: string = cookies.access_token;
    const decoded_access_token: IJwtUserVerification = <IJwtUserVerification>this.jwtService.decode(access_token);
    return decoded_access_token ? <AxiosRequestConfig>{
      headers: {
        Authorization: `Userkeyauth ${this.getBase64(`${this.config.REDTAIL_API_KEY}:${decoded_access_token.sub}`)}`,
        ['Content-Type']: 'application/json'
      }
    } : null;
  }

  /**
   * Creates a base64 string given a value.
   * @param {string} value 
   * @returns {string}
   */
  getBase64(value: string): string {
    return Buffer.from(value).toString('base64');
  }

}
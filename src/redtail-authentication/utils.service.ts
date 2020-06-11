import { Inject, Injectable, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AxiosRequestConfig } from 'axios';
import { IJwtUserVerification } from '../interfaces';
import { MODULE_CONFIG, RedtailAuthenticationConfig } from './config';

@Injectable()
export class UtilsService {

  constructor(@Inject(MODULE_CONFIG) private config: RedtailAuthenticationConfig,
              private jwtService: JwtService) {}

  getHeaders(@Req() req): AxiosRequestConfig {
    // DECODE JWT
    const access_token: string = req.cookies.access_token;
    const decoded_access_token: IJwtUserVerification = <IJwtUserVerification>this.jwtService.decode(access_token);
    return <AxiosRequestConfig>{
      headers: {
        Authorization: `Userkeyauth ${this.getBase64(`${this.config.REDTAIL_API_KEY}:${decoded_access_token.sub}`)}`,
        ['Content-Type']: 'application/json'
      }
    };
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
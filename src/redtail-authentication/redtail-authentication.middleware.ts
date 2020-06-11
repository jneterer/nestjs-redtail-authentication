import { Injectable, NestMiddleware, Req, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtInvalid, IJwtUserVerification } from 'src/interfaces';

@Injectable()
export class RedtailAuthenticationMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(@Req() req, @Res() res, next: () => void) {
    if (req.cookies) {
      const access_token: string = req.cookies['access_token'];
      const refresh_token: string = req.cookies['refresh_token'];
      if (access_token && refresh_token) {
        const access_token_state: string = this.verifyAccessToken(access_token);
        // Verify the access token is valid.
        if (access_token_state === 'Valid') {
          // If the access token is valid, verify the refresh token is valid.
          if (this.verifyRefreshToken(refresh_token)) {
            // If the refresh token is valid, verify that the access token is set 
            // as the sub proprety on the refresh token.
            const decoded_refresh_token: IJwtUserVerification = <IJwtUserVerification>this.jwtService.decode(refresh_token);
            if (decoded_refresh_token.sub === access_token) {
              console.log('access and refresh token are valid and access token pairs with refresh token.');
              next();
            } else {
              console.log('access token and refresh token are valid but are not paired.');
              this.clearCookiesAndRespond(res);
            }
          } else {
            // If the refresh token is invalid, then clear both access and refresh
            // token cookies and return unauthorized.
            console.log('access token is valid but refresh token is not.');
            this.clearCookiesAndRespond(res);
          }
        } else if (access_token_state === 'TokenExpiredError') {
          // If the access token is expired, determine if the refresh token is valid.
          if (this.verifyRefreshToken(refresh_token)) {
            // If the refresh token is valid, then issue a new access token and refresh
            // token and allow the call to proceed.
            const decoded_access_token: IJwtUserVerification  = <IJwtUserVerification>this.jwtService.decode(access_token);
            if (decoded_access_token.username && decoded_access_token.sub) {
              const new_access_token: string = this.jwtService.sign({
                username: decoded_access_token.username,
                sub: decoded_access_token.sub
              }, {
                expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES
              });
              const new_refresh_token: string = this.jwtService.sign({
                username: decoded_access_token.username,
                sub: new_access_token
              }, {
                expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES
              });
              res
              .cookie('access_token', new_access_token)
              .cookie('refresh_token', new_refresh_token);
              console.log('access token is invalid, issued new access and refresh token, proceed.');
              next();
            } else {
              // If there is no username or sub associated with the access token, then 
              // clear both access and refresh token cookies and return unauthorized.
              this.clearCookiesAndRespond(res);
            }
          } else {
            // If the refresh token is invalid, then clear both access and refresh
            // token cookies and return unauthorized.
            console.log('both access token and refresh token are invalid.');
            this.clearCookiesAndRespond(res);
          }
        } else {
          // The access token is invalid for another reason other than time expired (might have been
          // modified). Clear both access and refresh token cookies and return unauthorized.
          console.log('access token might have been modified, clearing cookies.');
          this.clearCookiesAndRespond(res);
        }
      } else {
        // No access token or refresh token present on the request. Clear both access 
        // and refresh token cookies and return unauthorized.
        this.clearCookiesAndRespond(res);
      }
    } else {
      // No cookies are present on the request. Clear both access and refresh token 
      // cookies and return unauthorized.
      this.clearCookiesAndRespond(res);
    }
  }

  /**
   * Verifies the access token and returns the token's state as a string.
   * @param {string} access_token 
   * @returns {string}
   */
  verifyAccessToken(access_token: string): string {
    try {
      this.jwtService.verify(access_token);
      return 'Valid';
    } catch (e) {
      const error: IJwtInvalid = e;
      return error.name;
    }
  }

  /**
   * Verifies the refresh token and returns a boolean.
   * @param {string} access_token 
   * @returns {boolean}
   */
  verifyRefreshToken(refresh_token: string): boolean {
    try {
      this.jwtService.verify(refresh_token);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Clears the access and refresh tokens and returns 401 unauthorized.
   * @param {@Res} res
   * @returns {Response}
   */
  clearCookiesAndRespond(@Res() res): Response {
    return res
    .clearCookie('access_token')
    .clearCookie('refresh_token')
    .status(401)
    .send({
      statusCode: 401,
      message: 'Unauthorized.'
    });
  }
}

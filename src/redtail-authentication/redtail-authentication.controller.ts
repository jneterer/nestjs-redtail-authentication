import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { first } from 'rxjs/operators';
import { LoginDto } from '../classes';
import { RedtailAuthenticationService } from './redtail-authentication.service';

@Controller('auth')
export class RedtailAuthenticationController {

  constructor(private authService: RedtailAuthenticationService) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res) {
    const response = await this.authService.login(body.username, body.password).pipe(first()).toPromise();
    if (response.access_token && response.refresh_token) {
      res
      .cookie('access_token', response.access_token)
      .cookie('refresh_token', response.refresh_token)
      .status(200)
      .send({
        statusCode: 200,
        message: 'SUCCESS'
      });
    } else {
      res
      .clearCookie('access_token')
      .clearCookie('refresh_token')
      .status(response['statusCode'])
      .send(response);
    }
  }

  @Post('logout')
  logout(@Res() res) {
    res
    .clearCookie('access_token')
    .clearCookie('refresh_token')
    .status(200)
    .send({
      statusCode: 200,
      message: 'SUCCESS'
    });
  }

  @Get('authenticated')
  authenticated(@Req() req) {
    return this.authService.authenticated(req.cookies);
  }

}

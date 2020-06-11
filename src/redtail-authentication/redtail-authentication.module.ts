import { DynamicModule, HttpModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DEFAULT_MODULE_CONFIG, MODULE_CONFIG, RedtailAuthenticationConfig } from './config';
import { RedtailAuthenticationController } from './redtail-authentication.controller';
import { RedtailAuthenticationService } from './redtail-authentication.service';
import { UtilsService } from './utils.service';

/**
 * LibraryName description
 */
@Module({})
export class RedtailAuthenticationModule {

  /**
   * Register the module
   * @param config configuration for module
   */
  static register(config: RedtailAuthenticationConfig): DynamicModule {
    return {
      module: RedtailAuthenticationModule,
      providers: [
        {
          provide: MODULE_CONFIG,
          useValue: config || DEFAULT_MODULE_CONFIG
        },
        RedtailAuthenticationService,
        UtilsService
      ],
      imports: [
        HttpModule,
        JwtModule.register({
          secret: config.JWT_SECRET
        })
      ],
      exports: [
        HttpModule,
        JwtModule,
        RedtailAuthenticationService,
        UtilsService
      ],
      controllers: [
        RedtailAuthenticationController
      ]
    }
  }

}
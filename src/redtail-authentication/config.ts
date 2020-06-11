/**
 * Injector Token for Module configuration
 */
export const MODULE_CONFIG = Symbol('MODULE_CONFIG');

/**
 * Defines the available options to configure the Module
 */
export interface RedtailAuthenticationConfig {
  REDTAIL_BASE_URL: string;
  REDTAIL_API_KEY: string;
  JWT_SECRET: string;
  JWT_ACCESS_TOKEN_EXPIRES: string;
  JWT_REFRESH_TOKEN_EXPIRES: string;
}

/**
 * Default Module configuration if is not provided
 */
export const DEFAULT_MODULE_CONFIG: RedtailAuthenticationConfig = {
  REDTAIL_BASE_URL: 'REDTAIL BASE API URL',
  REDTAIL_API_KEY: 'REDTAIL API KEY',
  JWT_SECRET: 'JWT SECRET',
  JWT_ACCESS_TOKEN_EXPIRES: 'JWT ACCESS TOKEN EXPIRATION TIME | 15M',
  JWT_REFRESH_TOKEN_EXPIRES: 'JWT REFRESH TOKEN EXPIRATION TIME | 30M'
};
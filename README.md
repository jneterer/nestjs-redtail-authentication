### Installation

```
npm install nestjs-redtail-authentication
```

Import into your app.module.ts and register

```
imports: [
  ...
  RedtailAuthenticationModule.register({
    REDTAIL_BASE_URL: process.env.REDTAIL_BASE_URL 'https://redtailapiurl.com/api/v1',
    REDTAIL_API_KEY: process.env.REDTAIL_API_KEY 'your_api_key',
    JWT_SECRET: process.env.JWT_SECRET || 'my_secret',
    JWT_ACCESS_TOKEN_EXPIRES: process.env.JWT_ACCESS_TOKEN_EXPIRES || '15m',
    JWT_REFRESH_TOKEN_EXPIRES: process.env.JWT_REFRESH_TOKEN_EXPIRES || '30m'
  }),
  ...
]
```

## Change Log

See [Changelog](CHANGELOG.md) for more information.

## Author

Jacob Neterer - [my website](https://jacobneterer.com)

## License

Licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
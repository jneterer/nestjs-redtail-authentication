RELEASE 1.0.0
* Initial commit

RELEASE 1.0.1
* Updating README.md
* Adding middleware for authorizing requests

RELEASE 1.0.2
* Updating imports
* Updating README.md

RELEASE 1.0.3
* Exporting utils service to redtail-authentication/index.ts

RELEASE 1.0.4
* Updating utils getHeaders to accept cookies instead of the request in order to prevent circular references

RELEASE 1.0.5
* Adding redtail http interceptor
* Fixing authenticated request to pass cookies to get headers

RELEASE 1.0.6
* Fixing call to authentication by passing cookies instead of the entire request

RELEASE 1.0.7
* Checking that the access token exists before creating the headers
* Adding 401 unauthorized exception to the redtail http interceptor
* Sanitizing responses from Redtail to remove sensitive information
* Throw an unauthorized exception for the /authenticated endpoint
* Removing the http interceptor from the redtail-authentication.service since it is not applicable here

RELEASE 1.0.8
* Adding error support for class-validation errors. `class-validation` returns an error object different than an axios error, so we are extending the axios error to include support forthe `class-validation` error object
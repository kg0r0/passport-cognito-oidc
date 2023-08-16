#  passport-cognito-oidc
[![Npm package version](https://badgen.net/npm/v/passport-cognito-oidc)](https://badge.fury.io/js/passport-cognito-oidc)
[![CI](https://github.com/kg0r0/passport-cognito-oidc/actions/workflows/ci.yml/badge.svg)](https://github.com/kg0r0/passport-cognito-oidc/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Passport](http://passportjs.org/) strategies for authenticating with [Amazon Cognito user pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) using [OpenID Connect](https://openid.net/specs/openid-connect-core-1_0.html).

This is a library for the backend that depends on [Express](https://expressjs.com/). If you are looking for a frontend library, you may use [Amplify Library](https://docs.amplify.aws/lib/auth/social/q/platform/js/#setup-frontend). Also, if you prefer to use [Cognito user pools API](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pools-API-operations.html) for sign-in, the [AWS SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cognito-identity-provider/index.html) is available.

## Usage

```js
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { Strategy as CognitoOIDCStrategy } from 'passport-cognito-oidc';

const app: express.Express = express()

passport.use(new CognitoOIDCStrategy({
  clientId: '<CLIENT_ID>',
  clientSecret: '<CLIENT_SECRET>',
  region: '<REGION>',
  userPoolId: '<USER_POOL_ID>',
  redirectUri: '<REDIRECT_URI>'
}));

/* ---- express-session ----*/
app.use(session({
  name: 'YOUR-SESSION-NAME',
  secret: 'YOUR-SECRET',
  resave: true,
  saveUninitialized: true
}));

app.get('/',
  passport.authenticate('cognito', {}),
  (req: express.Request, res: express.Response) => {
    res.send('OK');
  }
);
```

## Contributing
Thanks for your feedback and contribution to this repo!
Please feel free to open issues and send pull-requests.

## License

[MIT](LICENSE)

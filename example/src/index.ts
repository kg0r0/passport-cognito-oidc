import express from 'express';
import passport from 'passport';
import session from 'express-session';
import crypto from 'crypto';
import { Strategy as CognitoOIDCStrategy } from '../../lib';
const app: express.Express = express()

passport.use(new CognitoOIDCStrategy({
  clientId: process.env.CLIENT_ID || '<CLIENT_ID>',
  clientSecret: process.env.CLIENT_SECRET || '<CLIENT_SECRET>',
  region: process.env.REGION || '<REGION>',
  userPoolId: process.env.USER_POOL_ID || '<USER_POOL_ID>',
  redirectUri: process.env.REDIRECT_URI || '<REDIRECT_URI>'
}));

app.use(session({
  name: 'session',
  secret: [crypto.randomBytes(32).toString('hex')],
  resave: true,
  saveUninitialized: true
}));

/**
 * routes
 */
app.get('/*',
  passport.authenticate('cognito', {}),
  (req: express.Request, res: express.Response) => {
    res.send('OK');
  }
);

app.listen(3000, () => {
  console.log('listen port: 3000');
});
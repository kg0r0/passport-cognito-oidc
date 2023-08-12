import { Strategy as PassportStrategy } from 'passport-strategy';
import { AuthenticateOptions } from 'passport'
import { Request } from 'express';
import { Issuer, Client, TokenSet, generators } from 'openid-client';

declare module 'express-session' {
  export interface SessionData {
    authParams: AuthParams
    tokenSet: TokenSet
    isLoggedIn: Boolean
  }
}

export interface AuthParams {
  scope?: string
  state?: string
  nonce?: string
  codeVerifier?: string
  codeChallengeMethod?: string
  originalUrl?: string
}

export interface StrategyOptions {
  name?: string
  authParams?: AuthParams
  url?: string
  clientId: string
  clientSecret: string
  redirectUri: string
  region: string
  userPoolId: string
  responseType?: string
  scope?: string
}

export class AbstractStrategy extends PassportStrategy {
  name: string;
  authParams: AuthParams;
  client?: Client;
  issuer?: Issuer;
  url: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  region: string;
  userPoolId: string;
  responseType: string
  scope: string

  constructor(options: StrategyOptions) {
    super();
    this.name = options.name || 'cognito';
    this.authParams = options.authParams || {};
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.redirectUri = options.redirectUri;
    this.region = options.region;
    this.userPoolId = options.userPoolId;
    this.responseType = options.responseType || 'code';
    this.url = options.url || `https://cognito-idp.${this.region}.amazonaws.com/${this.userPoolId}/.well-known/openid-configuration`;
    this.scope = options.scope || 'openid';
}

  async authenticate(req: Request, options: AuthenticateOptions): Promise<void> {
    if (!this.issuer) {
      this.issuer = await Issuer.discover(this.url)
    }
    this.client = new this.issuer.Client({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uris: [this.redirectUri],
      response_types: [this.responseType]
    })
    if (!req.session) {
      throw new Error('express-session is not configured')
    }

    if (req.session.isLoggedIn) {
      this.pass();
      return
    }

    if (req.query.code && req.session.authParams) {
      const state = req.session.authParams.state;
      const codeVerifier = req.session.authParams.codeVerifier;
      const nonce = req.session.authParams.nonce;
      const params = this.client.callbackParams(req);
      const tokenSet = await this.client.callback(
        this.redirectUri,
        params,
        {
          state,
          nonce,
          code_verifier: codeVerifier
        }
      )
      req.session.tokenSet = tokenSet;
      req.session.isLoggedIn = true;
      return req.res?.redirect(req.session.authParams.originalUrl!);
    }
    const scope = this.scope;
    const nonce = generators.nonce();
    const state = generators.state();
    const codeVerifier = generators.codeVerifier();
    const codeChallenge = generators.codeChallenge(codeVerifier);
    req.session.authParams = {};
    req.session.authParams.scope = scope;
    req.session.authParams.nonce = nonce;
    req.session.authParams.state = state;
    req.session.authParams.codeVerifier = codeVerifier;
    req.session.authParams.codeChallengeMethod = 'S256';
    req.session.authParams.originalUrl = req.originalUrl;
    this.authParams = req.session.authParams
    const authorizationUrl = this.client.authorizationUrl({
      response_type: this.responseType,
      scope,
      state,
      nonce,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    })
    return req.res?.redirect(authorizationUrl);
  }

  success(user: any, info?: any): void {
    super.success(user, info);
  }

  error(err: Error): void {
    super.error(err);
  }

  redirect(url: string, status?: number): void {
    super.redirect(url, status);
  }

  verify(): void {

  }
}

export class Strategy extends AbstractStrategy {
}
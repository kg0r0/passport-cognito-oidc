import { Strategy as PassportStrategy } from 'passport-strategy';
import { AuthenticateOptions } from 'passport';
import { Request } from 'express';
import { Issuer, Client, TokenSet } from 'openid-client';
declare module 'express-session' {
    interface SessionData {
        authParams: AuthParams;
        tokenSet: TokenSet;
        isLoggedIn: boolean;
    }
}
export interface AuthParams {
    scope?: string;
    state?: string;
    nonce?: string;
    codeVerifier?: string;
    codeChallengeMethod?: string;
    originalUrl?: string;
}
export interface StrategyOptions {
    name?: string;
    authParams?: AuthParams;
    url?: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    region: string;
    userPoolId: string;
    responseType?: string;
    scope?: string;
}
export declare abstract class AbstractStrategy extends PassportStrategy {
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
    responseType: string;
    scope: string;
    constructor(options: StrategyOptions);
    authenticate(req: Request, options: AuthenticateOptions): Promise<void>;
    success(user: unknown, info?: unknown): void;
    error(err: Error): void;
    redirect(url: string, status?: number): void;
}
export declare class Strategy extends AbstractStrategy {
    constructor(options: StrategyOptions);
}

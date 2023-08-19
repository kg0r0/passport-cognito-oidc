"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategy = exports.AbstractStrategy = void 0;
const passport_strategy_1 = require("passport-strategy");
const openid_client_1 = require("openid-client");
class AbstractStrategy extends passport_strategy_1.Strategy {
    constructor(options) {
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
    authenticate(req, options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.issuer) {
                this.issuer = yield openid_client_1.Issuer.discover(this.url);
            }
            this.client = new this.issuer.Client({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                redirect_uris: [this.redirectUri],
                response_types: [this.responseType]
            });
            if (options.session === false || !req.session) {
                throw new Error('express-session is not configured');
            }
            if (req.session.isLoggedIn) {
                this.pass();
                return;
            }
            if (req.query.code && req.session.authParams) {
                const state = req.session.authParams.state;
                const codeVerifier = req.session.authParams.codeVerifier;
                const nonce = req.session.authParams.nonce;
                const params = this.client.callbackParams(req);
                const tokenSet = yield this.client.callback(this.redirectUri, params, {
                    state,
                    nonce,
                    code_verifier: codeVerifier
                });
                req.session.tokenSet = tokenSet;
                req.session.isLoggedIn = true;
                return (_a = req.res) === null || _a === void 0 ? void 0 : _a.redirect(req.session.authParams.originalUrl);
            }
            const scope = options.scope || this.scope;
            const nonce = openid_client_1.generators.nonce();
            const state = openid_client_1.generators.state();
            const codeVerifier = openid_client_1.generators.codeVerifier();
            const codeChallenge = openid_client_1.generators.codeChallenge(codeVerifier);
            req.session.authParams = {};
            req.session.authParams.scope = scope;
            req.session.authParams.nonce = nonce;
            req.session.authParams.state = state;
            req.session.authParams.codeVerifier = codeVerifier;
            req.session.authParams.codeChallengeMethod = 'S256';
            req.session.authParams.originalUrl = req.originalUrl;
            this.authParams = req.session.authParams;
            const authorizationUrl = this.client.authorizationUrl({
                response_type: this.responseType,
                scope,
                state,
                nonce,
                code_challenge: codeChallenge,
                code_challenge_method: 'S256',
            });
            return (_b = req.res) === null || _b === void 0 ? void 0 : _b.redirect(authorizationUrl);
        });
    }
    success(user, info) {
        super.success(user, info);
    }
    error(err) {
        super.error(err);
    }
    redirect(url, status) {
        super.redirect(url, status);
    }
}
exports.AbstractStrategy = AbstractStrategy;
class Strategy extends AbstractStrategy {
    constructor(options) {
        super(options);
    }
}
exports.Strategy = Strategy;

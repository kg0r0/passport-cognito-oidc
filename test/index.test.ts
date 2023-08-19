import { Strategy } from '../src'
import express from 'express';
import nock from 'nock';

beforeEach(() => {
  nock('https://cognito-idp.us-east-1.amazonaws.com')
    .get('/TEST_USER_POOL_ID/.well-known/openid-configuration')
    .reply(200, {
      authorization_endpoint: 'https://cognito-idp.us-east-1.amazonaws.com/oauth2/authorize'
    })
})

describe('Strategy', () => {
  const strategy = new Strategy({
    clientId: 'TEST_CLIENT_ID',
    clientSecret: 'TEST_CLIENT_SECRET',
    redirectUri: 'TEST_REDIRECT_URI',
    region: 'us-east-1',
    userPoolId: 'TEST_USER_POOL_ID'
  });
  describe('authenticate', () => {
    it('authenticate should not throw error', async () => {
      const mockRequest = {
        query: {
        },
        session: {
        }
      } as unknown as express.Request;
      await strategy.authenticate(mockRequest, {});
    })

    it('returns error when session is not set.', async () => {
      const mockRequest = {
        query: {
        }
      } as unknown as express.Request;
      try {
        await strategy.authenticate(mockRequest, {});
      } catch (err) {
        if (err instanceof Error) {
          expect(err.message).toBe('express-session is not configured')
        }
      }
    })
  })
})
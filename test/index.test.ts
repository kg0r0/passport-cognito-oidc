import { Strategy } from '../src'
import express from 'express';
import nock from 'nock';

beforeEach(() => {
  nock('https://127.0.0.1')
    .get('/.well-known/openid-configuration')
    .reply(200, {
      authorization_endpoint: 'https://127.0.0.1/authorize'
    })
})

describe('Strategy', () => {
  const strategy = new Strategy({
    clientId: 'TEST_CLIENT_ID',
    clientSecret: 'TEST_CLIENT_SECRET',
    redirectUri: 'TEST_REDIRECT_URI',
    region: 'TEST_REGION',
    userPoolId: 'TEST_USER_POOL_ID'
  });
  const mockRequest = {
    query: {
    },
    session: {
    }
  } as unknown as express.Request;
  it('authenticate should not throw error', () => {
    strategy.authenticate(mockRequest, {});
  })
})
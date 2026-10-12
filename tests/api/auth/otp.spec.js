// @ts-check
import { test, expect } from '@playwright/test';

/* 
API: /auth/otp
Request: POST
Parameters: 
- username (String)
- otp (String)
- type (String)
 */

/**
 * @type {import("playwright-core").APIRequestContext}
 */
let apiContext;

test.describe('Verify OTP API', () => {
    test.beforeAll(async ({ playwright }) => {
        apiContext = await playwright.request.newContext({baseURL: 'http://localhost:3000/auth/otp'});
    });

    test('Invalid parameters - should return error code', async () => {
        const badParameters = { username: 'bademail', otp: 'letters', type: 'stafff' };
        const apiCall = await apiContext.post('', {data: badParameters});

        expect(apiCall.status()).toEqual(422);
    });

    test('Account doesn\'t exist - should return error code', async () => {
        const credentials = { username: 'nonentity@gmail.com', otp: '49851', type: 'staff' };
        const apiCall = await apiContext.post('', {data: credentials});
        expect(apiCall.status()).toEqual(401);
        expect(await apiCall.text()).toEqual('Username not found');
    });

    test('Incorrect OTP - should return error code', async () => {
        const credentials = { username: 'existing.person@student.curtin.edu.au', otp: '123', type: 'student' };
        const apiCall = await apiContext.post('', {data: credentials});
        expect(apiCall.status()).toEqual(401);
        expect(await apiCall.text()).toEqual('Incorrect OTP');
    });

    test('Correct OTP - should return success code and store session cookie', async () => {
        const credentials = { username: 'existing.person@student.curtin.edu.au', otp: '58197', type: 'student' };
        
        const apiCall = await apiContext.post('', {data: credentials});

        expect(apiCall.status()).toEqual(200);

        const cookies = (await apiContext.storageState()).cookies;
        const tokenCookie = cookies.find(c => c.name === 'token');
        expect(tokenCookie).toBeTruthy();
    });
});

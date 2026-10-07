// @ts-check
import { test, expect } from '@playwright/test';

/* 
API: /auth/login
Request: POST
Parameters: 
 - email (String)
 - password (String)
 - type (String)
 */

/**
 * @type {import("playwright-core").APIRequestContext}
 */
let apiContext;

test.describe('Verify login API', () => {
    test.beforeAll(async ({ playwright }) => {
        apiContext = await playwright.request.newContext({baseURL: 'http://localhost:3000/auth/login'});
    });

    test('Invalid parameters - should return error code', async () => {
        const badParameters = { username: 'bademail', password: '', type: 'unitcoordinator' };
        const apiCall = await apiContext.post('', {data: badParameters});

        expect(apiCall.status()).toEqual(422);
    });

    test('Account doesn\'t exist - should return error code', async () => {
        const credentials = { username: 'nonentity@gmail.com', password: '123', type: 'staff' };
        const apiCall = await apiContext.post('', {data: credentials});
        expect(apiCall.status()).toEqual(401);
        expect(await apiCall.text()).toEqual('Username not found');
    });

    test('Invalid credentials - should return error code', async () => {
        const credentials = { username: 'existing.person@student.curtin.edu.au', password: '123', type: 'student' };
        const apiCall = await apiContext.post('', {data: credentials});
        expect(apiCall.status()).toEqual(401);
        expect(await apiCall.text()).toEqual('Incorrect password');
    });

    test('Valid credentials - should return success code and store session cookie', async () => {
        const credentials = { username: 'existing.person@student.curtin.edu.au', password: 'n6fLmXiOdxWi', type: 'student' };
        
        const apiCall = await apiContext.post('', {data: credentials});

        expect(apiCall.status()).toEqual(200);

        const cookies = (await apiContext.storageState()).cookies;
        const tokenCookie = cookies.find(c => c.name === 'token');
        expect(tokenCookie).toBeTruthy();
    });
});

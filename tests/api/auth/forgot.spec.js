// @ts-check
import { test, expect } from '@playwright/test';

/* 
API: /auth/forgotPassword
Request: POST
Parameters: 
- email (String)
- type (String)
 */

/**
 * @type {import("playwright-core").APIRequestContext}
 */
let apiContext;

test.describe('Verify Forgot Password API', () => {
    test.beforeAll(async ({ playwright }) => {
        apiContext = await playwright.request.newContext({baseURL: 'http://localhost:3000/auth/forgotPassword'});
    });

    test('Invalid parameters - should return error code', async () => {
        const badParameters = { email: 'bademail', type: 'unitcoordinator' };
        const response = await apiContext.post('', {data: badParameters});
        
        expect(response.status()).toEqual(422);
    });

    test('Account doesn\'t exist - should return error code', async () => {
        const parameters = { email: 'nonentity@curtin.edu.au', type: 'staff' };

        const response = await apiContext.post('', {data: parameters});

        expect(response.status()).toEqual(401);
        expect(await response.text()).toEqual('Account not found');
    });

    test('Account exists - should return success code', async () => {
        const parameters = { email: 'josiahwb@outlook.com.au', type: 'student' };
        const response = await apiContext.post('', {data: parameters});
        
        expect(response.status()).toEqual(200);
    });
});

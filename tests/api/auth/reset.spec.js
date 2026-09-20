// @ts-check
import { test, expect } from '@playwright/test';

/* 
API: /auth/resetPassword
Request: POST
Parameters: 
- password (String)
- reconfirmPassword (String)
 */

/**
 * @type {import("playwright-core").APIRequestContext}
 */
let apiContext;

test.describe('Verify Reset Password API', () => {
    test.beforeAll(async ({ playwright }) => {
        apiContext = await playwright.request.newContext({baseURL: 'http://localhost:3000/auth/resetPassword'});
    });

    test('Invalid parameters - should return error code', async () => {
        const newPassword = { password: '', reconfirmPassword: '' };
        const response = await apiContext.post('', {data: newPassword});
        
        expect(response.status()).toEqual(422);
    });

    test('Not logged in - should return error code', async () => {
        const newPassword = { password: 'S3cure!', reconfirmPassword: 'S3cure!' };
        const response = await apiContext.post('', {data: newPassword});

        expect(response.status()).toEqual(401);
        const responseMessage = await response.json();
        expect(responseMessage.message).toEqual('Not authorised');
    });

    test('Mismatching passwords - should return error code', async ({ request }) => {
        const credentials = { username: 'some.guy@student.curtin.edu.au', password: 'DhBU6nfNykHy', type: 'student' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});
        
        const newPassword = { password: 'S3cure!', reconfirmPassword: 'RandomPassword' };
        const response = await request.post('http://localhost:3000/auth/resetPassword', {data: newPassword});

        expect(response.status()).toEqual(400);
        const responseMessage = await response.json();
        expect(responseMessage.message).toEqual('Passwords do not match');
    });

    test('Matching passwords + logged in - should return success code', async ({ request }) => {       
        const credentials = { username: 'some.guy@student.curtin.edu.au', password: 'DhBU6nfNykHy', type: 'student' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});
        
        const newPassword = { password: 'DhBU6nfNykHy', reconfirmPassword: 'DhBU6nfNykHy' };
        const response = await request.post('http://localhost:3000/auth/resetPassword', {data: newPassword});

        expect(response.status()).toEqual(200);
        const responseMessage = await response.json();
        expect(responseMessage.message).toEqual('Password Changed Successfully!');
    });
});

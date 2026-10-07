// @ts-check
import { test, expect } from '@playwright/test';

/* 
API: /auth/verifyEmail
Request: POST
Parameters: 
- otp (String)
 */

/**
 * @type {import("playwright-core").APIRequestContext}
 */
let apiContext;

test.describe('Verify Personal Email Verification API', () => {
    test.beforeAll(async ({ playwright }) => {
        apiContext = await playwright.request.newContext({baseURL: 'http://localhost:3000/auth/verifyEmail'});
    });

    test('Invalid parameters - should return error code', async () => {
        const emptyOTP = { newEmail: '' };
        const apiCall = await apiContext.post('', {data: emptyOTP});
        
        expect(apiCall.status()).toEqual(422);
    });

    test('Not logged in - should return error code', async () => {
        const otp = { otp: '36213' };
        const apiCall = await apiContext.post('', {data: otp});

        expect(apiCall.status()).toEqual(401);
        const responseMessage = await apiCall.json();
        expect(responseMessage.message).toEqual('Not authorised');
    });

    test('Staff account - should return error code', async ({ request }) => {       
        const credentials = { username: 'staff.member@curtin.edu.au', password: 'FXS9wRCP2rag', type: 'staff' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});

        const otp = { otp: '36213' };
        const response = await request.post('http://localhost:3000/auth/verifyEmail', {data: otp});
        expect(response.status()).toEqual(403);
    });

    test('Incorrect OTP', async ({ request }) => {       
        const credentials = { username: 'existing.person@student.curtin.edu.au', password: 'n6fLmXiOdxWi', type: 'student' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});

        const otp = { otp: '36213' };
        const response = await request.post('http://localhost:3000/auth/verifyEmail', {data: otp});
        expect(response.status()).toEqual(401);
    });

    test('Logged in + correct OTP - should return success code', async ({ request }) => {       
        const credentials = { username: 'existing.person@student.curtin.edu.au', password: 'n6fLmXiOdxWi', type: 'student' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});

        const otp = { otp: '58197' };
        const response = await request.post('http://localhost:3000/auth/verifyEmail', {data: otp});
        expect(response.status()).toEqual(200);
    });
});

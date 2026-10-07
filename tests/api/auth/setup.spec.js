// @ts-check
import { test, expect } from '@playwright/test';
const mongoose = require('mongoose');
require("dotenv").config();

// @ts-ignore
mongoose.connect(process.env.MONGODB_STRING, {dbName: 'test'});

const {
    CapstoneStudent
} = require("../../../models/index.js");

/* 
API: /auth/setup
Request: POST
Parameters:
- email (String)
- type (String)
 */

/**
 * @type {import("playwright-core").APIRequestContext}
 */
let apiContext;

test.describe('Verify Setup Account API', () => {
    test.beforeAll(async ({ playwright }) => {
        apiContext = await playwright.request.newContext({baseURL: 'http://localhost:3000/auth/setup'});
    });

    test('Invalid parameters - should return error code', async () => {
        const badParameters = { email: 'bademail', type: 'unitcoordinator' };
        const apiCall = await apiContext.post('', {data: badParameters});
        
        expect(apiCall.status()).toEqual(422);
    });

    test('Account already exists - should return error code', async () => {
        const credentials = { email: 'existing.person@student.curtin.edu.au', type: 'student' };
        const apiCall = await apiContext.post('', {data: credentials});
        expect(apiCall.status()).toEqual(422);
        expect(await apiCall.text()).toEqual('Account already exists');
    });

    test('Non-Curtin email address - should return error code', async () => {
        const credentials = { email: 'intruder@uwa.edu.au', type: 'student' };
        const apiCall = await apiContext.post('', {data: credentials});
        expect(apiCall.status()).toEqual(422);
        expect(await apiCall.text()).toEqual('Non-Curtin email address');
    });

    test('Staff doesn\'t have staff email - should return error code', async () => {
        const credentials = { email: 'pleb@student.curtin.edu.au', type: 'staff' };
        const apiCall = await apiContext.post('', {data: credentials});
        expect(apiCall.status()).toEqual(422);
        expect(await apiCall.text()).toEqual('Staff must have staff email address');
    });

    test('Valid details - should return success code and created account', async () => {
        const credentials = { email: '20216829@student.curtin.edu.au', type: 'student' };
        const apiCall = await apiContext.post('', {data: credentials});
        expect(apiCall.status()).toEqual(201);

        const account = await apiCall.json();
        expect(account.Username).toEqual('20216829@student.curtin.edu.au');

        await CapstoneStudent.deleteOne({Username: credentials.email});
    });
});

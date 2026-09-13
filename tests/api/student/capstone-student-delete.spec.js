// Test code for Task-61, deleting existing capstone students. Test designed based off Josiah Barnes' guide. [Noel Kapadia]

import { test, expect } from '@playwright/test';

/**
 * @type {import("playwright-core").APIRequestContext}
 */

let apiContext;

test.describe('Verify Capstone Student Delete API', () => {
    test.beforeAll(async ({ playwright }) => {
        apiContext = await playwright.request.newContext({baseURL: 'http://localhost:3000'});
    });

    test('Should successfully delete an existing Capstone student', async () => {
        const apiCall = await apiContext.delete('/capstone/deletebyID/3333', {data: credentials});

        expect(apiCall.status()).toEqual(200);

    });

});
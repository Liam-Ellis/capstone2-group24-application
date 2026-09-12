// Test code for Task-61, deleting existing HCI students. Test designed based off Josiah Barnes' guide. [Noel Kapadia]

import { test, expect } from '@playwright/test';

/**
 * @type {import("playwright-core").APIRequestContext}
 */

let apiContext;

test.describe('Verify HCI Student Delete API', () => {
    test.beforeAll(async ({ playwright }) => {
        apiContext = await playwright.request.newContext({baseURL: 'http://localhost:3000'});
    });

    test('Should successfully Delete an existing HCI student', async () => {
        const apiCall = await apiContext.delete('/hci/deletebyID/3333', {data: credentials});

        expect(apiCall.status()).toEqual(200);

    });

});
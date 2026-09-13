// Test code for Task-61, editing existing HCI students. Test designed based off Josiah Barnes' guide. [Noel Kapadia]

import { test, expect } from '@playwright/test';

/**
 * @type {import("playwright-core").APIRequestContext}
 */

let apiContext;

test.describe('Verify HCI Student Update API', () => {
    test.beforeAll(async ({ playwright }) => {
        apiContext = await playwright.request.newContext({baseURL: 'http://localhost:3000'});
    });

    test('Should successfully update an existing Capstone student', async () => {
        const credentials = { Email: 'test.student@curtin.edu.au', Group: 2 };
        const apiCall = await apiContext.put('/hci/updatebyID/3333', {data: credentials});

        expect(apiCall.status()).toEqual(200);

    });

});
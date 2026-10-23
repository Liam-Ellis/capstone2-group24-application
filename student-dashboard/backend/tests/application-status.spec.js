import { test, expect } from '@playwright/test';
import mongoose from 'mongoose';

const statusURL = 'http://localhost:3000/api/application/status';

test.describe('Verify get application status', () => {
    test('Student has not applied for the application', async ({ request }) => {
        const response = await request.get(statusURL);

        expect(response.status()).toBe(200);

        const result = await response.json();

        expect(result.applied).toBe(false);
        expect(result.roundStatus).toBe('CLOSED');
        expect(result.message).toBe('Not Applied');
    });

    test('Student has applied for the application', async ({ request }) => {
        const response = await request.get(statusURL);

        expect(response.status()).toBe(200);

        const result = await response.json();

        expect(result.applied).toBe(true);
        expect(result.roundStatus).toBe('OPEN');
        expect(result.message).toBe('Applied');
    });

    test('Application round is open', async ({ request }) => {
        const response = await request.get(statusURL);

        expect(response.status()).toBe(200);

        const result = await response.json();

        expect(result.roundStatus).toBe('OPEN');
    });

    test('Application round is closed', async ({ request }) => {
        const response = await request.get(statusURL);

        expect(response.status()).toBe(200);

        const result = await response.json();

        expect(result.roundStatus).toBe('CLOSED');
        expect(result.message).toBe('This application round is closed.');
    });
});


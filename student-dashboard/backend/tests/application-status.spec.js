import { test, expect } from '@playwright/test';

const prefURL = 'http://localhost:3000/application-status';

test.describe('Verify get application status', () => {
    test('Student has not applied for the application', async ({ request }) => {
        const response = await request.get(`${prefURL}`);

        expect(response.status()).toEqual(401);

        const result = await response.json();

        expect(result).toHaveProperty('not applied');
        expect(result).toHaveProperty(message);

        expect(typeof result.applied).toBe('boolean');
        expect(typeof result.message).toBe('string');
    });

    test('Student has applied for the application', async ({ request }) => {
        const response = await request.get(`${prefURL}`);

        expect(response.status()).toEqual(401);

        const result = await response.json();

        expect(result).toHaveProperty('applied');
        expect(result).toHaveProperty(message);

        expect(typeof result.applied).toBe('boolean');
        expect(typeof result.message).toBe('string');
    });
});


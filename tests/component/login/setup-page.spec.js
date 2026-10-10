// @ts-check
import { test, expect } from '@playwright/test';

test.use({baseURL: 'http://localhost:5173'})

test.describe('Setup Account Page', () => {
    test('All elements are visible', async ({ page }) => {
        await page.goto('/setup');

        await expect(page.getByRole('heading', {name: 'Create Account'})).toBeVisible();

        await expect(page.getByLabel('Type')).toBeVisible();
        await expect(page.getByLabel('Curtin Email')).toBeVisible();
        await expect(page.getByRole('button', {name: 'Create Account'})).toBeVisible();
    });

    test('No error or success message when first loaded', async ({ page }) => {
        await page.goto('/setup');

        await expect(page.locator('css=error-msg-div')).toHaveCount(0);
        await expect(page.locator('css=success-msg-div')).toHaveCount(0);
    });

    test('Email field works', async ({ page }) => {
        await page.goto('/setup');

        await page.getByLabel('Curtin Email').fill('test@curtin.edu.au');
        await expect(page.getByLabel('Curtin Email')).toHaveValue('test@curtin.edu.au');
    });

    test('Option dropdown works and has 2 options - Staff and Student', async ({ page }) => {
        await page.goto('/setup');

        await page.getByLabel('Type').selectOption('Staff');
        await expect(page.getByLabel('Type')).toHaveValue('Staff');

        await page.getByLabel('Type').selectOption('Student');
        await expect(page.getByLabel('Type')).toHaveValue('Student');
    });

    test('Submit button works', async ({ page }) => {
        await page.goto('/setup');

        await page.getByRole('button', {name: 'Create Account'}).click({ force: true });
    });
});

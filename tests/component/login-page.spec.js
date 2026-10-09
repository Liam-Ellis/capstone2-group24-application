// @ts-check
import { test, expect } from '@playwright/test';

test.use({baseURL: 'http://localhost:5173'})

test.describe('Login Page - UI components', () => {
    test('All elements are visible', async ({ page }) => {
        await page.goto('/login');

        await expect(page.getByRole('heading', {name: 'Log In'})).toBeVisible();

        await expect(page.getByLabel('Type')).toBeVisible();
        await expect(page.getByLabel('Curtin Email')).toBeVisible();
        await expect(page.getByLabel('Password')).toBeVisible();
        await expect(page.getByRole('button')).toBeVisible();

        await expect(page.getByRole('link', {name: 'Create an account'})).toBeVisible();
        await expect(page.getByRole('link', {name: 'Forgot password'})).toBeVisible();
    });

    test.fixme('Text fields work', async ({ page }) => {
    });

    test.fixme('Password field text is hidden', async ({ page }) => {
    });

    test.fixme('Option dropdown works and has 2 options - staff and student', async ({ page }) => {
    });

    test.fixme('Submit button works', async ({ page }) => {
    });

    test.fixme('No error or success message when first loaded', async ({ page }) => {
    });
});

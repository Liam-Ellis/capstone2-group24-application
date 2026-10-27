// @ts-check
import { test, expect } from '@playwright/test';

test.use({baseURL: 'http://localhost:5173'})

test.describe('Forgot Password Page', () => {
    test('All elements are visible', async ({ page }) => {
        await page.goto('/forgot');

        await expect(page.getByRole('heading', {name: 'Forgot Password'})).toBeVisible();

        await expect(page.getByLabel('Type')).toBeVisible();
        await expect(page.getByLabel('Account Email')).toBeVisible();
        await expect(page.getByRole('button', {name: 'Verify Details'})).toBeVisible();
    });

    test('No error message when first loaded', async ({ page }) => {
        await page.goto('/forgot');

        await expect(page.locator('css=error-msg-div')).toHaveCount(0);
    });

    test('Email field works', async ({ page }) => {
        await page.goto('/forgot');

        await page.getByLabel('Account Email').fill('test@curtin.edu.au');
        await expect(page.getByLabel('Account Email')).toHaveValue('test@curtin.edu.au');
    });

    test('Option dropdown works and has 2 options - Staff and Student', async ({ page }) => {
        await page.goto('/forgot');

        await page.getByLabel('Type').selectOption('Staff');
        await expect(page.getByLabel('Type')).toHaveValue('Staff');

        await page.getByLabel('Type').selectOption('Student');
        await expect(page.getByLabel('Type')).toHaveValue('Student');
    });

    test('Submit button works', async ({ page }) => {
        await page.goto('/forgot');

        await page.getByRole('button', {name: 'Verify Details'}).click({ force: true });
    });
});

// @ts-check
import { test, expect } from '@playwright/test';

test.use({baseURL: 'http://localhost:5173'})

test.describe('Reset Password Page', () => { 
    test.fixme('All elements are visible', async ({ page }) => {
        await expect(page.getByRole('heading', {name: 'Reset Password'})).toBeVisible();
        await expect(page.getByRole('paragraph', {name: 'Create a strong password to secure your account'})).toBeVisible();
                
        await expect(page.getByLabel('New Pasword')).toBeVisible();
        await expect(page.getByLabel('Re-Enter New Pasword')).toBeVisible();

        await expect(page.getByRole('button', {name: 'Submit'})).toBeVisible();
    });

    test.fixme('No error or success message when first loaded', async ({ page }) => {
        await expect(page.locator('css=error-msg-div')).toHaveCount(0);
        await expect(page.locator('css=success-msg-div')).toHaveCount(0);
    });

    test.fixme('Password fields work', async ({ page }) => {
        await page.getByLabel('New Pasword').fill('password123');
        await expect(page.getByLabel('New Pasword')).toHaveValue('password123');

        await page.getByLabel('Re-Enter New Pasword').fill('password246');
        await expect(page.getByLabel('Re-Enter New Pasword')).toHaveValue('password246');
    });

    test.fixme('Submit button works', async ({ page }) => {
        await page.getByRole('button', {name: 'Submit'}).click({ force: true });
    });
});

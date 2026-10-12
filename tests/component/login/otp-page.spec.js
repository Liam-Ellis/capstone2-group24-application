// @ts-check
import { test, expect } from '@playwright/test';

test.use({baseURL: 'http://localhost:5173'})

test.describe('OTP Entry Page', () => { 
    test.fixme('All elements are visible', async ({ page }) => {
        await expect(page.getByRole('heading', {name: 'One-Time-Password'})).toBeVisible();

        await expect(page.getByRole('paragraph', {name: 'Please enter the OTP sent to your email'})).toBeVisible();
        await expect(page.getByRole('button', {name: 'Submit'})).toBeVisible();
    });

    test.fixme('No error message when first loaded', async ({ page }) => {
        await expect(page.locator('css=error-msg-div')).toHaveCount(0);
    });

    test.fixme('OTP field - filling works', async ({ page }) => {
        await page.getByRole('textbox').fill('123')

        await expect(page.getByRole('textbox')).toHaveValue('123')

    });

    test.fixme('OTP field - Backspace works', async ({ page }) => {
    });

    test.fixme('OTP field - Pasting from clipboard is allowed', async ({ page }) => {
    });

    test.fixme('Submit button works', async ({ page }) => {
        await page.getByRole('button', {name: 'Submit'}).click({ force: true });
    });
});

# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: application-status.spec.js >> Verify get application status >> Student has not applied for the application
- Location: tests/application-status.spec.js:7:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import mongoose from 'mongoose';
  3  | 
  4  | const statusURL = 'http://localhost:3000/api/application/status';
  5  | 
  6  | test.describe('Verify get application status', () => {
  7  |     test('Student has not applied for the application', async ({ request }) => {
  8  |         const response = await request.get(statusURL);
  9  | 
  10 |         expect(response.status()).toBe(200);
  11 | 
  12 |         const result = await response.json();
  13 | 
> 14 |         expect(result.applied).toBe(false);
     |                                ^ Error: expect(received).toBe(expected) // Object.is equality
  15 |         expect(result.roundStatus).toBe('CLOSED');
  16 |         expect(result.message).toBe('Not Applied');
  17 |     });
  18 | 
  19 |     test('Student has applied for the application', async ({ request }) => {
  20 |         const response = await request.get(statusURL);
  21 | 
  22 |         expect(response.status()).toBe(200);
  23 | 
  24 |         const result = await response.json();
  25 | 
  26 |         expect(result.applied).toBe(true);
  27 |         expect(result.roundStatus).toBe('OPEN');
  28 |         expect(result.message).toBe('Applied');
  29 |     });
  30 | 
  31 |     test('Application round is open', async ({ request }) => {
  32 |         const response = await request.get(statusURL);
  33 | 
  34 |         expect(response.status()).toBe(200);
  35 | 
  36 |         const result = await response.json();
  37 | 
  38 |         expect(result.roundStatus).toBe('OPEN');
  39 |     });
  40 | 
  41 |     test('Application round is closed', async ({ request }) => {
  42 |         const response = await request.get(statusURL);
  43 | 
  44 |         expect(response.status()).toBe(200);
  45 | 
  46 |         const result = await response.json();
  47 | 
  48 |         expect(result.roundStatus).toBe('CLOSED');
  49 |         expect(result.message).toBe('This application round is closed.');
  50 |     });
  51 | });
  52 | 
  53 | 
```
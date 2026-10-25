// @ts-check
import { test, expect } from '@playwright/test';

/* 
API: student/prefs
Request: POST
Parameters: N/A
*/

const prefURL = 'http://localhost:3000/student/prefs';

test.describe('Verify Add Preferences (Student) API', () => {
    test('Not logged in - should return error code', async ({ request }) => {
        const response = await request.post(`${prefURL}`);
            
        expect(response.status()).toEqual(401);
        expect(await response.text()).toEqual('Not authorised');
    });
    
    test('Logged in - should return success code', async ({ request }) => {
        const credentials = { username: 'random.human@student.curtin.edu.au', password: 'n6fLmXiOdxWi', type: 'student' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});

        const preferences = { prefsFor: ['','','Tim Flanders','',''], prefsAgainst: ['','','','James Joyce','']};
        const response = await request.post(`${prefURL}`, {data: preferences});

        expect(response.status()).toEqual(200);

        const prefs = await response.json();

        const prefsFor = prefs.prefsFor;
        const prefsAgainst = prefs.prefsAgainst;

        expect(prefsFor[2]).toEqual('Tim Flanders');
        expect(prefsAgainst[3]).toEqual('James Joyce');
    });
});
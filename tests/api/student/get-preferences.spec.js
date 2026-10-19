// @ts-check
import { test, expect } from '@playwright/test';

/* 
API: student/prefs
Request: GET
Parameters: N/A
*/

const prefURL = 'http://localhost:3000/student/prefs';

test.describe('Verify Get Preferences (Student) API', () => {
    test('Not logged in - should return error code', async ({ request }) => {
        const response = await request.get(`${prefURL}`);
            
        expect(response.status()).toEqual(401);
        expect(await response.text()).toEqual('Not authorised');
    });
    
    test('Logged in - should return student preferences', async ({ request }) => {
        const credentials = { username: 'josiahwb@outlook.com.au', password: 'sFUrspt6sM9N', type: 'student' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});

        const response = await request.get(`${prefURL}`);

        expect(response.status()).toEqual(200);

        const prefs = await response.json();

        const prefsFor = prefs.prefsFor;
        const prefsAgainst = prefs.prefsAgainst;

        expect(prefsFor[0]).toEqual('Bob Jimmy');
        expect(prefsAgainst[0]).toEqual('Jane doe');
    });
});
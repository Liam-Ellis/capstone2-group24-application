// @ts-check
import { test, expect } from '@playwright/test';

/* 
 API: /auth/loggedInStudentStatus
 Request: GET
 Parameters: 
 N/A
*/

const apiURL1 = 'http://localhost:3000/auth/loggedInStudentStatus';

test.describe('Verify Logged-In Student Status API', () => {
    test('Not logged in as student - should return error code', async ({ request }) => {
        const response = await request.get(apiURL1);

        expect(response.status()).toEqual(401);
        const responseMessage = await response.text();
        expect(responseMessage).toEqual('Not authorised');
    });

    test('Logged in as student - should return success code', async ({ request }) => {       
        const credentials = { username: 'some.guy@student.curtin.edu.au', password: 'DhBU6nfNykHy', type: 'student' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});
        
        const response = await request.get(apiURL1);

        expect(response.status()).toEqual(200);
    });
});

/* 
 API: /auth/loggedInStaffStatus
 Request: GET
 Parameters: 
 N/A
*/

const apiURL2 = 'http://localhost:3000/auth/loggedInStaffStatus';

test.describe('Verify Verify Logged-In Staff Status API', () => {
    test('Not logged in as staff - should return error code', async ({ request }) => {
        const response = await request.get(apiURL2);

        expect(response.status()).toEqual(401);
        const responseMessage = await response.text();
        expect(responseMessage).toEqual('Not authorised');
    });

    test('Logged in as staff - should return success code', async ({ request }) => {       
        const credentials = { username: 'staff.member@curtin.edu.au', password: 'FXS9wRCP2rag', type: 'staff' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});
        
        const response = await request.get(apiURL2);

        expect(response.status()).toEqual(200);
    });
});

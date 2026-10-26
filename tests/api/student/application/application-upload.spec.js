// @ts-check
import { test, expect } from '@playwright/test';

/*
API: student/application/upload
Request: POST
Parameters:
- document (File)
- ID (String)
- Type (String)
*/

const applyURL = 'http://localhost:3000/student/application/upload';

test.describe('Verify Upload Application API', () => {
    test('Empty parameters - should return error code', async ({ request }) => {
        const credentials = { username: 'random.human@student.curtin.edu.au', password: 'n6fLmXiOdxWi', type: 'student' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});

        const response = await request.post(`${applyURL}`, {data: {}});

        expect(response.status()).toEqual(422);
        let responseJSON = await response.json();
        expect(responseJSON.message).toEqual("No project details sent");
    });

    test('Not logged in - should return error code', async ({ request }) => {
        const response = await request.post(`${applyURL}`);

        expect(response.status()).toEqual(401);
        expect(await response.text()).toEqual('Not authorised');
    });
    
    test('No resume for WORK project - should return error code', async ({ request }) => {
        const credentials = { username: 'random.human@student.curtin.edu.au', password: 'n6fLmXiOdxWi', type: 'student' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});

        const appDetails = new FormData();
        appDetails.append("document", '12345');
        appDetails.append("ID", '3');
        appDetails.append("Type", 'WORK');

        const response = await request.post(`${applyURL}`, {multipart: appDetails});
        expect(response.status()).toEqual(400);
        /*
        let responseJSON = await response.json();
        expect(responseJSON.message).toEqual('No Resume uploaded');*/
    });

    test('No cover letter for WORK project - should return error code', async ({ request }) => {
        const credentials = { username: 'random.human@student.curtin.edu.au', password: 'n6fLmXiOdxWi', type: 'student' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});

        const appDetails = new FormData();
        appDetails.append("ID", '3');
        appDetails.append("Type", 'WORK');

        const response = await request.post(`${applyURL}`, {multipart: appDetails});
        expect(response.status()).toEqual(400);
        let responseJSON = await response.json();
        expect(responseJSON.message).toEqual('No CV uploaded');
    });

    test.fixme('Valid application', async ({ request }) => {
        const credentials = { username: 'josiahwb@outlook.com.au', password: 'sFUrspt6sM9N', type: 'student' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});

        const appDetails = new FormData();
        appDetails.append("document", '12345');
        appDetails.append("ID", '3');
        appDetails.append("Type", 'WORK');

        const response = await request.post(`${applyURL}`, {multipart: appDetails});
        expect(response.status()).toEqual(201);
    });
});

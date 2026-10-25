// @ts-check
import { test, expect } from '@playwright/test';

/* 
API: student/group
Request: GET
*/

const groupURL = 'http://localhost:3000/student/group';

test.describe('Verify Get Allocated Group (Student) API', () => {
    test('Not logged in - should return error code', async ({ request }) => {
        const response = await request.get(`${groupURL}`);
    
        expect(response.status()).toEqual(401);
        expect(await response.text()).toEqual('Not authorised');
    });
    
    test('Student is not allocated to a group - should return error code', async ({ request }) => {
        const credentials = { username: 'existing.person@student.curtin.edu.au', password: 'n6fLmXiOdxWi', type: 'student' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});

        const response = await request.get(`${groupURL}`);

        expect(response.status()).toEqual(400);
    });

    test('Allocated group is not confirmed - should return error code', async ({ request }) => {
        const credentials = { username: 'existing.person@student.curtin.edu.au', password: 'n6fLmXiOdxWi', type: 'student' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});

        const response = await request.get(`${groupURL}`);

        expect(response.status()).toEqual(400);
    });

    test('Student is allocated - should return group details', async ({ request }) => {
        const credentials = { username: 'josiahwb@outlook.com.au', password: 'sFUrspt6sM9N', type: 'student' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});

        const response = await request.get(`${groupURL}`);

        expect(response.status()).toEqual(200);

        const group = await response.json();
        expect(group.GroupNumber).toEqual(3);
        expect(group.Students).toEqual(["James Anderson","Olivia Martin", "Liam Thompson"]);

        expect(group.Confirmed).toBeFalsy();
        expect(group.Reason).toBeFalsy();

        const project = group.Project;
        expect(project.Name).toEqual('Web Accessibility Project');
        expect(project.Client).toEqual('AWS');
        expect(project.ClientEmail).toEqual('jeff@amazon.com');
        expect(project.Description).toEqual('The best project');

        expect(project.ID).toBeFalsy();
        expect(project.Round).toBeFalsy();
        expect(project.IntendedSize).toBeFalsy();
    });
});
// @ts-check
import { test, expect } from '@playwright/test';

/* 
API: student/project
Request: GET
Parameters: ID (Integer)
*/

const projectURL = 'http://localhost:3000/student/project';

test.describe('Verify Get Project (Student) API', () => {
    test('Invalid parameters - should return error code', async ({ request }) => {
        const response = await request.get(`${projectURL}/`);

        expect(response.status()).toEqual(404);
    });

    test('Not logged in - should return error code', async ({ request }) => {
        const response = await request.get(`${projectURL}/1`);
            
        expect(response.status()).toEqual(401);
        expect(await response.text()).toEqual('Not authorised');
    });
    
    test('Non-existing project - should return error code', async ({ request }) => {
        const credentials = { username: 'some.guy@student.curtin.edu.au', password: 'DhBU6nfNykHy', type: 'student' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});

        const response = await request.get(`${projectURL}/100`);

        expect(response.status()).toEqual(404);
    });

    test('Existing project and student is allocated - should return client email', async ({ request }) => {
        const credentials = { username: 'some.guy@student.curtin.edu.au', password: 'DhBU6nfNykHy', type: 'student' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});

        const response = await request.get(`${projectURL}/2`);

        expect(response.status()).toEqual(200);

        const project = await response.json();
        expect(project.Type).toEqual('Group');
        expect(project.Round).toEqual(2);
        expect(project.Name).toEqual('Web Accessibility Project');
        expect(project.Client).toEqual('AWS');
        expect(project.ClientEmail).toEqual('jeff@amazon.com');
        expect(project.Description).toEqual('The best project');
    
        expect(project.ID).toBeFalsy();
        expect(project.IntendedSize).toBeFalsy();
    });

    test('Existing project and student is not allocated - should not return client email', async ({ request }) => {
        const credentials = { username: 'some.guy@student.curtin.edu.au', password: 'DhBU6nfNykHy', type: 'student' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});

        const response = await request.get(`${projectURL}/3`);

        expect(response.status()).toEqual(200);

        const project = await response.json();
        expect(project.Type).toEqual('Work');
        expect(project.Round).toEqual(2);
        expect(project.Name).toEqual('Hi-tech Vision Project');
        expect(project.Client).toEqual('ClearSight');
        expect(project.Description).toEqual('Techno gizmo project');
    
        expect(project.ClientEmail).toBeFalsy();
        expect(project.ID).toBeFalsy();
        expect(project.IntendedSize).toBeFalsy();
    });
});

/* 
API: student/projects
Request: GET
Parameters: round (Integer)
*/

const projectsURL = 'http://localhost:3000/student/projects';

test.describe('Verify Get Projects (Student) API', () => {
    test('Invalid parameters - should return error code', async ({ request }) => {
        const response = await request.get(`${projectsURL}/notanumber`);

        expect(response.status()).toEqual(422);
    });

    test('Not logged in - should return error code', async ({ request }) => {
        const response = await request.get(`${projectsURL}/2`);
            
        expect(response.status()).toEqual(401);
        expect(await response.text()).toEqual('Not authorised');
    });

    test('Round does not exist - should return error code', async ({ request }) => {
        const credentials = { username: 'some.guy@student.curtin.edu.au', password: 'DhBU6nfNykHy', type: 'student' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});

        const response = await request.get(`${projectsURL}/200`);

        expect(response.status()).toEqual(404);
    });

    test('No projects for given round - should return success code and empty array', async ({ request }) => {
        const credentials = { username: 'some.guy@student.curtin.edu.au', password: 'DhBU6nfNykHy', type: 'student' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});

        const response = await request.get(`${projectsURL}/1`);

        expect(response.status()).toEqual(200);

        const projects = await response.json();

        expect(projects.length).toEqual(0);
    });

    test('Projects exist for given round - should return success code and projects array', async ({ request }) => {
        const credentials = { username: 'some.guy@student.curtin.edu.au', password: 'DhBU6nfNykHy', type: 'student' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});

        const response = await request.get(`${projectsURL}/2`);

        expect(response.status()).toEqual(200);

        const projects = await response.json();

        // @ts-ignore
        projects.forEach((project) => {
            expect(project.Type).toBeTruthy();
            expect(project.Round).toBeTruthy();
            expect(project.Name).toBeTruthy();
            expect(project.Client).toBeTruthy();
            expect(project.Description).toBeTruthy();
        
            expect(project.ID).toBeFalsy();
            expect(project.IntendedSize).toBeFalsy();
        })
    });
});
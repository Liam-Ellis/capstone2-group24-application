import { test, expect } from '@playwright/test';



//testing for the different outcomes of posting an individual student

/**
 * @type {import("playwright-core").APIRequestContext}
 */
let apiContext;

test.describe('Individual studont POST', () => {
    test.beforeAll(async ({ playwright }) => {
        apiContext = await playwright.request.newContext({baseURL: 'http://localhost:3000/uc/editProj'});
    });





    test('valid API edit request', async () => {
        const validProject = ({
                ID: 1,
                Type: "Group",
                Round: 2,
                Name: "Liam's project",
                Description: "cool project",
                IntendedSize: 6
            });
        const response = await fetch('http://localhost:50000/api/SaveEditedProject', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json', // Tells backend to parse as JSON
                },
                body: JSON.stringify(validProject), // Converts JS object to JSON string
            });
            expect(response.status).toEqual(200);
    });


    test('invalid API edit request, ID doesnt exist', async () => {
        const invalidProject = ({
                ID: 10,
                Type: "Group",
                Round: 1,
                Name: "Liam's project",
                Description: "cool project",
                IntendedSize: 6
            });
        const response = await fetch('http://localhost:50000/api/SaveEditedProject', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json', // Tells backend to parse as JSON
                },
                body: JSON.stringify(invalidProject), // Converts JS object to JSON string
            });
            expect(response.status).toEqual(400);
    });

    

    
});


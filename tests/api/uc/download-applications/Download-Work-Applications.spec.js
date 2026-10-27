/*import { test, expect } from '@playwright/test';
const mongoose = require("mongoose")
const {Group} = require ("../../../../models")
require("dotenv").config();
mongoose.connect(process.env.MONGODB_STRING, {dbName: 'test'});


/**
 * @type {import("playwright-core").APIRequestContext}
 *//*
let apiContext;

//make sure these tests run one at a time, otherwise the tests editing the db would run at the same time as the tests checking the db.
test.describe.configure({ mode: 'series' }); 

test.describe('download Work applications tests', () => {
    test.beforeAll(async ({ playwright }) => {
        apiContext = await playwright.request.newContext({baseURL: 'http://localhost:3000/UC/downloadApplications'});
    });

    test('download all resumes test',{lock: 'Student_db',}, async ({page, browserName}) => {
        test.skip(browserName !== 'firefox', 'only 1 of this test should run at a time. Locks dont actually fix this issue, so this is how im handling it');
        
        const response = await fetch('http://localhost:3000/UC/api/getWorkProjectApplications', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json', // Tells backend to parse as JSON
                },
                body: JSON.stringify('23'), // Converts JS object to JSON string
            });
            expect(response.status).toEqual(200);
    });

});*/
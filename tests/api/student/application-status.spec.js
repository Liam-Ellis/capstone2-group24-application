import { test, expect } from '@playwright/test';
import mongoose from 'mongoose';
import Application from '../../../models/ProjectApplication';
require("dotenv").config();

const statusURL = 'http://localhost:3000/UC/api/applicationStatus';

const appliedPair = [ 
    new mongoose.Types.ObjectId().toString(),
    new mongoose.Types.ObjectId().toString(),
];

const notAppliedPair = [
    new mongoose.Types.ObjectId().toString(),
    new mongoose.Types.ObjectId().toString(),
];  

let apiContext

test.describe('Verify get application status', () => {
    
    test.beforeAll(async ({ playwright }) => {
        apiContext = await playwright.request.newContext({baseURL: 'http://localhost:3000/student/checkApplicationStatus'});
        await mongoose.connect(process.env.MONGODB_STRING, {dbName: 'test'});
        await Application.create({
            Student: appliedPair[0],
            Project: appliedPair[1],
            Type: "Resume",
            Resume: Buffer.from("resume")
        });
    });

    test.afterAll( async() => {
        await Application.deleteMany({ Student: appliedPair[0], Project: appliedPair[1]});
        await mongoose.disconnect();
    });

    test('Student has applied for the application', async ({ request }) => {
        const response = await request.get(statusURL, { params: { Student: appliedPair[0], Project: appliedPair[1] } 
        });

        expect(response.status()).toBe(200);

        const result = await response.json();

        expect(result).toBe(true);
    });

    test('Student has not applied for the application', async ({ request }) => {
        const response = await request.get(statusURL, { params: { Student: notAppliedPair[0], Project: notAppliedPair[1] } });

        expect(response.status()).toBe(200);

        const result = await response.json();

        expect(result).toBe(false);
    });

});


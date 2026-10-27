import { test, expect } from '@playwright/test';
import mongoose from 'mongoose';
import Application from '../models/ProjectApplication.js';

const statusURL = 'http://localhost:3000/api/application/status';
const MONGO_URI = "mongodb://kohmeiyun06_db_user:lrhfG7tc8mAkHKwb@ac-h3febtm-shard-00-00.17jnurt.mongodb.net:27017,ac-h3febtm-shard-00-01.17jnurt.mongodb.net:27017,ac-h3febtm-shard-00-02.17jnurt.mongodb.net:27017/?ssl=true&replicaSet=atlas-12gxsl-shard-0&authSource=admin"

const appliedPair = [ 
    new mongoose.Types.ObjectId().toString(),
    new mongoose.Types.ObjectId().toString(),
];

const notAppliedPair = [
    new mongoose.Types.ObjectId().toString(),
    new mongoose.Types.ObjectId().toString(),
];  

test.describe('Verify get application status', () => {
    test.beforeAll(async () => {
        await mongoose.connect(MONGO_URI, {dbName: 'test'});
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


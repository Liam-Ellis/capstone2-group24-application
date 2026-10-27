import {test, expect } from '@playwright/test';
import express from 'express';
import csvUploadRouter from '../../../routes/csvUpload';


let server;
let uploadURL;

test.beforeAll(async () => {
    const app = express();
    app.use(csvUploadRouter);
    await new Promise((resolve) => {server = app.listen(0, () => resolve(undefined)); });
    uploadURL = `http://localhost:${server.address().port}/upload`;
});

test.afterAll(() => {
    server.close();
});

test.describe('Verify CSV Upload API', () => {
    test('Unknown student type - should return an error code', async ({request}) => {
        const csv = 'STU_ID,STU_GVN_NM,STU_FAMILY_NM,AWARD_ON_SSP_1,CWA\n1,A,B,CS,70\n';
        const response = await request.post(`${uploadURL}/banana`, {
            multipart: { document: { name: 'students.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) } }
        });
        expect(response.status()).toEqual(400);
        expect((await response.json()).message).toEqual('Unknown Student Type.');
    });
    test('Non-CSV file - should return error code', async ({ request }) => {
        const response = await request.post(`${uploadURL}/capstone`, {
            multipart: { document: { name: 'photo.png', mimeType: 'image/png', buffer: Buffer.from('not a csv') 
} }
        });
        expect(response.status()).toEqual(415);
        expect((await response.json()).message).toEqual('Sorry, only CSV files are accepted.');
    });

    test('File over 5MB - should return error code', async ({ request }) => {
        const response = await request.post(`${uploadURL}/capstone`, {
            multipart: { document: { name: 'big.csv', mimeType: 'text/csv', buffer: Buffer.alloc(5 * 1024 * 1024 + 1, 'a') } }
        });
        
        expect(response.status()).toEqual(413);
    });
 
    test('No file attached - should return error code', async ({ request }) => {
        const response = await request.post(`${uploadURL}/capstone`, { data: {} });
 
        expect(response.status()).toEqual(400);
    });

    test('Malformed row - should return error code', async ({ request }) => {
        const csv = 'STU_ID,STU_GVN_NM,STU_FAMILY_NM,AWARD_ON_SSP_1,CWA\n1,A,B,CS,70,EXTRA,FIELDS\n';
        const response = await request.post(`${uploadURL}/capstone`, {
            multipart: { document: { name: 'students.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) } }
        });
 
        expect(response.status()).toEqual(400);
    });
});

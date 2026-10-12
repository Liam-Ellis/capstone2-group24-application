// @ts-check
import { test, expect } from '@playwright/test';

/* 
API: student/round
Request: GET
Parameters: id (Number)
*/

const roundURL = 'http://localhost:3000/student/round';

test.describe('Verify Get Round (Student) API', () => {
    test('Invalid parameters - should return error code', async ({ request }) => {
        const response = await request.get(`${roundURL}/nonnumbers`);
            
        expect(response.status()).toEqual(422);
    });

    test('Not logged in - should return error code', async ({ request }) => {
        const response = await request.get(`${roundURL}/1`);
            
        expect(response.status()).toEqual(401);
        expect(await response.text()).toEqual('Not authorised');
    });
    
    test('Non-existing round - should return error code', async ({ request }) => {
        const credentials = { username: 'some.guy@student.curtin.edu.au', password: 'DhBU6nfNykHy', type: 'student' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});

        const response = await request.get(`${roundURL}/100`);

        expect(response.status()).toEqual(404);
    });

    test('Existing round - should return success code and object', async ({ request }) => {
        const credentials = { username: 'some.guy@student.curtin.edu.au', password: 'DhBU6nfNykHy', type: 'student' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});

        const response = await request.get(`${roundURL}/2`);

        const round = await response.json();
        expect(round.RoundNumber).toEqual(2);
        expect(round.StartDate).toEqual('2026-12-17T00:00:00.000Z');
        expect(round.EndDate).toEqual('2027-01-31T00:00:00.000Z');

        expect(response.status()).toEqual(200);
    });
});

/* 
API: student/rounds
Request: GET
Parameters: N/A
*/

const roundsURL = 'http://localhost:3000/student/rounds';

test.describe('Verify Get Rounds (Student) API', () => {
    test('Not logged in - should return error code', async ({ request }) => {
        const response = await request.get(roundsURL);
            
        expect(response.status()).toEqual(401);
        expect(await response.text()).toEqual('Not authorised');
    });

    test('Logged in - should return success code and round objects', async ({ request }) => {
        const credentials = { username: 'some.guy@student.curtin.edu.au', password: 'DhBU6nfNykHy', type: 'student' };
        await request.post('http://localhost:3000/auth/login', {data: credentials});

        const response = await request.get(roundsURL);

        expect(response.status()).toEqual(200);

        const rounds = await response.json();
        // @ts-ignore
        rounds.forEach((round) => {
            expect(round.RoundNumber).toBeTruthy();
            expect(round.StartDate).toBeTruthy();
            expect(round.EndDate).toBeTruthy();
        })
    });
});
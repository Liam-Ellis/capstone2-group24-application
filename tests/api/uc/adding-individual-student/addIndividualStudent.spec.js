import { test, expect } from '@playwright/test';
const mongoose = require("mongoose")
const {CapstoneStudent} = require ("../../../../models")
const DATABASE_PATH = "mongodb://liam_db_user:LiamPassword@ac-h3febtm-shard-00-00.17jnurt.mongodb.net:27017,ac-h3febtm-shard-00-01.17jnurt.mongodb.net:27017,ac-h3febtm-shard-00-02.17jnurt.mongodb.net:27017/?ssl=true&replicaSet=atlas-12gxsl-shard-0&authSource=admin&appName=Capstone24"
mongoose.connect(DATABASE_PATH, {dbName: 'test'});


//testing for the different outcomes of posting an individual student

/**
 * @type {import("playwright-core").APIRequestContext}
 */
let apiContext;

test.describe('Individual student POST', () => {
    test.beforeAll(async ({ playwright }) => {
        apiContext = await playwright.request.newContext({baseURL: 'http://localhost:3000/uc/addIndv'});
    });

    test('valid API Post request',{lock: 'POST_valid_indivdual_student',}, async () => {
        const validStudent = ({
                studentId: "12341234",
                lastName: "Student",
                firstName: "Valid",
                email: "validStudent@testemail",
                course: "doesn't matter",
                unit: ["ISAD"]
            });
        const response = await fetch('http://localhost:3000/UC/api/POST_student', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json', // Tells backend to parse as JSON
                },
                body: JSON.stringify(validStudent), // Converts JS object to JSON string
            });
            expect(response.status).toEqual(200);

            const student = await CapstoneStudent.findOne({ StudentID: "12341234"})

            expect(student).not.toBeNull()

            //cleanup
            await CapstoneStudent.deleteOne({StudentID: "12341234"})

    });


    test('invalid API Post request, student already exists', async () => {
        const alreadyExistsStudent = ({
                studentId: "josiahwb",
                lastName: "Student",
                firstName: "Valid",
                email: "validStudent@testemail",
                course: "doesn't matter",
                unit: ["ISAD"]
            });
        const response = await fetch('http://localhost:3000/UC/api/POST_student', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json', // Tells backend to parse as JSON
                },
                body: JSON.stringify(alreadyExistsStudent), // Converts JS object to JSON string
            });
            expect(response.status).toEqual(401);
    });

    test('invalid API Post request, invalid email', async () => {
        const badEmailStudent = ({
                studentId: "12345678",
                lastName: "Student",
                firstName: "Valid",
                email: "validStudentBadtestemail",
                course: "doesn't matter",
                unit: ["ISAD"]
            });
        const response = await fetch('http://localhost:3000/UC/api/POST_student', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json', // Tells backend to parse as JSON
                },
                body: JSON.stringify(badEmailStudent), // Converts JS object to JSON string
            });
            expect(response.status).toEqual(400);
    });

    test('invalid API Post request, invalid student id', async () => {
        const invalidIDStudent = ({
                studentId: "1",
                lastName: "Student",
                firstName: "Valid",
                email: "validStudentBadtestemail",
                course: "doesn't matter",
                unit: ["ISAD"]
            });
        const response = await fetch('http://localhost:3000/UC/api/POST_student', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json', // Tells backend to parse as JSON
                },
                body: JSON.stringify(invalidIDStudent), // Converts JS object to JSON string
            });
            expect(response.status).toEqual(400);
    });

    
});


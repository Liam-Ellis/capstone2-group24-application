import { test, expect } from '@playwright/test';
const mongoose = require("mongoose")
const {Project} = require ("../../../../models")
const DATABASE_PATH = "mongodb://liam_db_user:LiamPassword@ac-h3febtm-shard-00-00.17jnurt.mongodb.net:27017,ac-h3febtm-shard-00-01.17jnurt.mongodb.net:27017,ac-h3febtm-shard-00-02.17jnurt.mongodb.net:27017/?ssl=true&replicaSet=atlas-12gxsl-shard-0&authSource=admin&appName=Capstone24"
mongoose.connect(DATABASE_PATH, {dbName: 'ccp24'});

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
                ID: -1,
                Type: "WORK",
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

            const projectToEdit = await Project.findOne({ ID: -1})

            expect(projectToEdit.Type).toEqual("WORK")
            expect(projectToEdit.Round).toEqual(2)
            expect(projectToEdit.Name).toEqual("Liam's project")
            expect(projectToEdit.Description).toEqual("cool project")
            expect(projectToEdit.IntendedSize).toEqual(6)


            //cleanup
            projectToEdit.Type =  "Group"
            projectToEdit.Round =  1
            projectToEdit.Name =  "Testing Project"
            projectToEdit.Description =  "This is for playwright testing"
            projectToEdit.IntendedSize =  6
            projectToEdit.save()
    });


    test('invalid API edit request, ID doesnt exist', async () => {
        const invalidProject = ({
                ID: -10,
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


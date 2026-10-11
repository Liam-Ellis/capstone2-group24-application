import { test, expect } from '@playwright/test';
const mongoose = require("mongoose")
const {Project} = require ("../../../../models")
const DATABASE_PATH = "mongodb://liam_db_user:LiamPassword@ac-h3febtm-shard-00-00.17jnurt.mongodb.net:27017,ac-h3febtm-shard-00-01.17jnurt.mongodb.net:27017,ac-h3febtm-shard-00-02.17jnurt.mongodb.net:27017/?ssl=true&replicaSet=atlas-12gxsl-shard-0&authSource=admin&appName=Capstone24"
mongoose.connect(DATABASE_PATH, {dbName: 'test'});

//testing for the different outcomes of posting an individual student

/**
 * @type {import("playwright-core").APIRequestContext}
 */
let apiContext;

test.describe('Post new project', () => {
    test.beforeAll(async ({ playwright }) => {
        apiContext = await playwright.request.newContext({baseURL: 'http://localhost:3000/uc/addProj'});
    });

    test('valid API add request',{lock: 'project_db',}, async ({page, browserName}) => {
        test.skip(browserName !== 'firefox', 'only 1 of this test should run at a time and since this is backend it doesnt need to be tested on every browser. Locks dont actually fix this issue, so this is how im handling it');
        const validProject = ({
                ID: "-2",
                Type: "WORK",
                Round: 2,
                Name: "add new project",
                Client: "Liam Ellis",
                ClientEmail: "Liam@email",
                Description: "new project",
                IntendedSize: 6
            });
        const response = await fetch('http://localhost:3000/UC/api/SaveNewProject', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json', // Tells backend to parse as JSON
                },
                body: JSON.stringify(validProject), // Converts JS object to JSON string
            });
            expect(response.status).toEqual(200);

            const projectToEdit = await Project.findOne({ ID: -2})

            expect(projectToEdit.Type).toEqual("WORK")
            expect(projectToEdit.Round).toEqual(2)
            expect(projectToEdit.Name).toEqual("add new project")
            expect(projectToEdit.Description).toEqual("new project")
            expect(projectToEdit.IntendedSize).toEqual(6)


            //cleanup
            Project.deleteOne({ID: "-2"})
    });
});


import { test, expect } from '@playwright/test';
const mongoose = require("mongoose")
const {Group} = require ("../../../../models")
const DATABASE_PATH = "mongodb://liam_db_user:LiamPassword@ac-h3febtm-shard-00-00.17jnurt.mongodb.net:27017,ac-h3febtm-shard-00-01.17jnurt.mongodb.net:27017,ac-h3febtm-shard-00-02.17jnurt.mongodb.net:27017/?ssl=true&replicaSet=atlas-12gxsl-shard-0&authSource=admin&appName=Capstone24"
mongoose.connect(DATABASE_PATH, {dbName: 'test'});


/**
 * @type {import("playwright-core").APIRequestContext}
 */
let apiContext;

//make sure these tests run one at a time, otherwise the tests editing the db would run at the same time as the tests checking the db.
test.describe.configure({ mode: 'series' }); 

test.describe('Group allocation tests', () => {
    test.beforeAll(async ({ playwright }) => {
            apiContext = await playwright.request.newContext({baseURL: 'http://localhost:3000/uc/GetGroups'});
    });
    test.describe.configure({ mode: 'series' }); 
    
    test('Get All test Groups',{lock: 'Group_db',}, async () => {
        test.skip(browserName !== 'I need only 1 version of this test to run, the locks just dont work and this test refuses to not run in parralel with other tests');

        const response = await fetch('http://localhost:3000/UC/api/requestAllGroups', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json', // Tells backend to parse as JSON
            }
            });
            
        const groups = await response.json()
        expect(groups[0].GroupNumber).toEqual(3)
        expect(groups.length).toEqual(2)
        });


    test('Get all Capstone Students',{lock: 'Student_db',}, async () => {

        const response = await fetch('http://localhost:3000/UC/api/requestAllCapstoneStudents', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json', // Tells backend to parse as JSON
            }
            });
            
        const students = await response.json()
        expect(students[0].StudentID).toEqual("00000000")
        expect(students.length).toEqual(7)
    });

    test('Get all group projects',{lock: 'project_db',}, async () => {

        const response = await fetch('http://localhost:3000/UC/api/requestAllGroupProjects', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json', // Tells backend to parse as JSON
            }
            });
            
        const projects = await response.json()
        expect(projects[0].ID).toEqual("2")
        expect(projects[1].ID).toEqual("-1")
    });


    test('Save all Groups',{lock: 'Group_db',}, async ({page, browserName}) => {
        test.skip(browserName !== 'firefox', 'we only need to test on 1 browser, any more and there will be paralellism issues');
        const multipleGroups = 
            [
                {
                    Confirmed: 1,
                    GroupNumber: 3,
                    Project: '4',
                    Reason: 'Students were grouped based on their interest in accessibility and inclusive design.',
                    Students: [
                    'James Anderson',
                    'Olivia Martin',
                    'Liam Thompson'
                    ]
                },{
                    Confirmed: 1,
                    GroupNumber: 4,
                    Project: '5',
                    Reason: 'I wanted to make this group',
                    Students: [
                        'person 1',
                        'person 2',
                        'bonus person'
                    ]
                }
            ]
        const response = await fetch('http://localhost:3000/UC/api/SaveGroups', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json', // Tells backend to parse as JSON
                },
                body: JSON.stringify(multipleGroups), // Converts JS object to JSON string
            });
            expect(response.status).toEqual(200);

            var dbGroups = await Group.find({GroupNumber: '3'}).lean()
            expect(dbGroups[0].Project).toEqual('4')
            dbGroups = await Group.find({GroupNumber: '4'}).lean()
            expect(dbGroups[0].Project).toEqual('5')


            //cleanup
            await Group.deleteOne({GroupNumber: 4})
            const cleanupGroup = await Group.findOne({GroupNumber: 3})
            cleanupGroup.Project = '2'
            cleanupGroup.save()
    });

    
});
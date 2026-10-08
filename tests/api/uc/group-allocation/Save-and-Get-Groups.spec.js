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
test.describe.configure({ mode: 'default' }); 

test.describe('test Group allocation GET api', () => {
    test.beforeAll(async ({ playwright }) => {
            apiContext = await playwright.request.newContext({baseURL: 'http://localhost:3000/uc/GetGroups'});
    });
    
    test('Get All test Groups', async () => {

        const response = await fetch('http://localhost:3000/UC/api/requestAllGroups', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json', // Tells backend to parse as JSON
            }
            });
            
        const groups = await response.json()
        //console.log("\n\n\n\n\n" + JSON.stringify(groups) + "\n\n\n\n")
        expect(groups[0].GroupNumber).toEqual(3)
        expect(groups[1].GroupNumber).toEqual(2)
        });


    test('Get all Capstone Students', async () => {

        const response = await fetch('http://localhost:3000/UC/api/requestAllCapstoneStudents', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json', // Tells backend to parse as JSON
            }
            });
            
        const students = await response.json()
        //console.log("\n\n\n\n\n" + JSON.stringify(groups) + "\n\n\n\n")
        expect(students[0].StudentID).toEqual("00000000")
        expect(students[1].StudentID).toEqual("00000000")
        expect(students[2].StudentID).toEqual("00000000")
        expect(students[3].StudentID).toEqual("231251")
    });

    test('Get all group projects', async () => {

        const response = await fetch('http://localhost:3000/UC/api/requestAllGroupProjects', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json', // Tells backend to parse as JSON
            }
            });
            
        const projects = await response.json()
        //console.log("\n\n\n\n\n" + JSON.stringify(groups) + "\n\n\n\n")
        expect(projects[0].ID).toEqual("2")
        expect(projects[1].ID).toEqual("-1")
    });
});

test.describe('test Group allocation GET api', () => {
    test.beforeAll(async ({ playwright }) => {
            apiContext = await playwright.request.newContext({baseURL: 'http://localhost:3000/uc/SaveGroups'});
    });


    test('Save all Groups', {lock: 'GroupDB',}, async () => {
        const multipleGroups = 
            [
                {
                    Confirmed: NumberInt('1'),
                    GroupNumber: NumberInt('3'),
                    Project: '4',
                    Reason: 'Students were grouped based on their interest in accessibility and inclusive design.',
                    Students: [
                    'James Anderson',
                    'Olivia Martin',
                    'Liam Thompson'
                    ]
                },{
                    Confirmed: NumberInt('1'),
                    GroupNumber: NumberInt('4'),
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

            const dbGroups = await Group.find().lean()
            expect(dbGroups[0].Project).toEqual('4')
            expect(dbGroups[2].Project).toEqual('5')


            //cleanup
            await CapstoneStudent.deleteOne({GroupNumber: "4"})
            const cleanupGroup = await Group.findOne({GroupNumber: '3'}).lean()
            cleanupGroup.Project = '2'
            cleanupGroup.save()
    });

    
});
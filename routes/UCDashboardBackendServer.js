//currently if you want to run this you can use the command
//    node thisFile'sName
//this program will not fully work without a mongodb to connect to

const express = require("express")
const ucBackend = express.Router();
const mongoose = require("mongoose")
const cors = require ("cors")
const {CapstoneStudent, Group, ProjectApplication, Round, Project} = require ("../models")
const { group } = require("node:console")
const fs = require ("node:fs")
const AdmZip = require("adm-zip");
//const { boolean } = require("joi")
const joi = require('joi');

const validationSchemas = {
    saveRoundSchema: joi.object({
        startDate: joi.date().required(),
        endDate: joi.date().required(),
    }),
    editRoundSchema: joi.object({
        id: joi.number().required(),
        startDate: joi.date().required(),
        endDate: joi.date().required(),
    }),
    getProjectsSchema: joi.object({
        round: joi.number().required(),
    }),
};

const validateParameters = (schema, property) => {
    return async (req, res, next) => {
        const { error } = schema.validate(req.params);

        if (error == null) {
            next();
        } else {
            const { details } = error;
            const errorMsg = details.map(error => error.message).join(',');

            res.status(422).json({ message: errorMsg });
        }
    };
};

const validateBodyParameters = (schema, property) => {
    return async (req, res, next) => {
        const { error } = schema.validate(req.body);

        if (error == null) {
            next();
        } else {
            const { details } = error;
            const errorMsg = details.map(error => error.message).join(',');

            res.status(422).json({ message: errorMsg });
        }
    };
};

ucBackend.post('/api/SaveNewRound', validateBodyParameters(validationSchemas.saveRoundSchema), async (req, res) => {
    const {StartDate, EndDate} = req.body

    const trueStartDate = Date(StartDate);
    const trueEndDate = Date(EndDate);

    if (trueEndDate <= trueStartDate) {
        return res.status(400).send('Start date must precede end date');
    }

    const rounds = await Round.find().lean();
    
    const numRounds = rounds.length;

    const newRound = await Round.create({
        RoundNumber: numRounds + 1,
        StartDate: trueStartDate,
        EndDate: trueEndDate,
    });

    res.status(201).json(newRound);
});

ucBackend.post('/api/EditRound', validateBodyParameters(validationSchemas.editRoundSchema), async (req, res) => {
    const {RoundNumber, StartDate, EndDate} = req.body

    const round = await Round.find({RoundNumber: RoundNumber}).exec();

    if (!round) {
        return res.status(404).send('Round does not exist');
    }

    const trueStartDate = Date(StartDate);
    const trueEndDate = Date(EndDate);

    if (trueEndDate <= trueStartDate) {
        return res.status(400).send('Start date must precede end date');
    }

    round.StartDate = trueStartDate;
    round.EndDate = trueEndDate;

    await round.save();

    res.status(200).json(round);
});

ucBackend.get('/api/requestAllRounds', async (req, res) =>{
    const rounds = await Round.find().lean()
    res.status(200).json(rounds);
});

ucBackend.get('/api/projects/:round', validateParameters(validationSchemas.getProjectsSchema), async (req, res) => {
    const projects = await Project.find({ Round: req.params.round }).lean();
    const round = await Round.findOne({ RoundNumber: req.params.round }).lean();

    if (round === null) {
        res.sendStatus(404);
    }
    else {
        res.status(200).json(projects);
    }
});

//
ucBackend.post('/api/POST_student', async (req, res) => {
    console.log(req.body)
    //const StudentObject = JSON.parse(req.body)
    const StudentObject = req.body
    let studentDBModel = null;
    try
    {
    //check to see if the student is valid and create the object required
        studentDBModel = createValidStudent(StudentObject)
        console.log(studentDBModel)
            
    } catch (exception)
    {
        console.log("student failed to save, was invalid")
        //a lot of different probalems can get us here, but most of them are just the user inputting an invalid student
        return res.status(400).json({
            message: "object given was not a valid student"
        }).end()
    }

    //next we see if the student exists in the database already, if they do then we don't want a duplicate of them
    const isInDb = await studentExistsInDB(StudentObject)
    if (isInDb)
    {
        return res.status(401).json({
            message: "student already exists"
        }).end()
    }

    const newStudent = new CapstoneStudent(studentDBModel)
    await newStudent.save()
    console.log("student saved")
    return res.status(200).json({ 
        message: "Data received successfully"
    }).end()
    
});

ucBackend.get('/api/requestAllCapstoneStudents', async (req, res) => {
    const students = await CapstoneStudent.find({Unit: "ISAD3000"}).lean()
    //convert the java object 'students' into a JSON object, then send it to whoever called this.
    res.send(JSON.stringify(students))
});

ucBackend.get('/api/requestAllGroups', async (req, res) =>{
    const groups = await Group.find().lean()
    //convert the java object 'students' into a JSON object, then send it to whoever called this.
    res.send(JSON.stringify(groups))
});

ucBackend.get('/api/requestAllGroupProjects', async (req, res) =>{
    const groups = await Project.find({Type: "Group"}).lean()
    //convert the java object 'students' into a JSON object, then send it to whoever called this.
    res.send(JSON.stringify(groups))
});

ucBackend.get('/api/requestAllProjects', async (req, res) =>{
    const groups = await Project.find().lean()
    //convert the java object 'students' into a JSON object, then send it to whoever called this.
    res.send(JSON.stringify(groups))
});

ucBackend.get('/api/requestAllGroupApplicationsForStudent/:ID', async (req, res) => {
    const StudentID = req.params.ID
    const groups = await ProjectApplication.find(
        {
            Student: StudentID,
            Type: "Group"
        }
    ).lean()
    //convert the java object 'students' into a JSON object, then send it to whoever called this.
    res.send(JSON.stringify(groups))
});

ucBackend.post('/api/SaveNewProject', async (req, res) => {
    const inProject = req.body
    console.log("saving new project: \n" + inProject + "\n")
    const checkForExistingProject = await Project.findOne({ ID: inProject.ID})

    if (checkForExistingProject != null) {
        return res.status(400).json({
            message: "project already exists"
        }).end()
        return
    }

    
    const newProject = new Project(inProject)
    await newProject.save()

    res.status(200).json(newProject);
    
});


//saves any edits to projects. mostly commented out as this needs some changes, as to edit a project it needs an identifyer 
//but the only identifyer currently is the project's name. This means the UC could theoretically edit the name, which would make it impossible find 
//the correct project to save over. 
//the solution here is to add some form of ID that the UC can't edit, although that means changing the schema, which I need to discuss with the team.
ucBackend.post('/api/SaveEditedProject', async (req, res) => {
    const inProject = req.body
    console.log("inbound project to edit: \n" + inProject + "\n")
    const projectToEdit = await Project.findOne({ ID: inProject.ID})

    if (projectToEdit == null) {
        return res.status(400).json({
            message: "could not find project to edit"
        }).end()
        return
    }

    projectToEdit.Type =  inProject.Type
    projectToEdit.Round =  inProject.Round
    projectToEdit.Name =  inProject.Name
    projectToEdit.Client = inProject.Client
    projectToEdit.ClientEmail = inProject.ClientEmail
    projectToEdit.Description =  inProject.Description
    projectToEdit.IntendedSize =  inProject.IntendedSize
    await projectToEdit.save()

    res.status(200).json(projectToEdit);
    
});

/* not neccessary
app.get('/api/requestStudentsApplyingForProject', async (req, res) =>{
    const groupToEdit = await Group.find({})
    //convert the java object 'students' into a JSON object, then send it to whoever called this.
    res.send(JSON.stringify(groups))
});
*/

ucBackend.post('/api/SaveGroups', async (req, res) => {
    //this makes the assumption that the groups are sent as an array of JSONs
    const groups = req.body
    
    //loop through every group sent in by the frontend
    for (let i = 0; i < groups.length; i++) {
        console.log("start of group " + i)
        //check to see if this group exists in the database already
        const groupToEdit = await Group.findOne({GroupNumber: groups[i].GroupNumber})
        //if this group doesn't exist in the database yet
        if (groupToEdit == null){
            const newGroup = new Group(groups[i])
            await newGroup.save()
        } else {//if this group already exists in the database
            groupToEdit.Confirmed = groups[i].Confirmed
            groupToEdit.Project = groups[i].Project
            groupToEdit.Reason = groups[i].Reason
            groupToEdit.Students = groups[i].Students
            await groupToEdit.save()
        }
    };
    res.status(200).json({ 
        message: "project edited successfully"
    }).end()
});

ucBackend.post('/api/SaveStudentGroups', async (req, res) => {
    const students = JSON.parse(req.body)
    
    //loop through every student sent in by the frontend
    for (let i = 0; i < groups.length; i++) {
        //check to see if this student exists in the database already
        const studentToEdit = await CapstoneStudent.findOne({StudentID: students[i].StudentID})
        //if this group doesn't exist in the database yet
        if (studentToEdit == null){
            res.status(400).json({ 
                message: "student not found"
            }).end()
        } else {//all's good, edit the student's group
            studentToEdit.Group = students[i].Group
        }
    }
});






//function to check if a student exists in the capstone student database. duplicates are determined by student ID
async function studentExistsInDB(inStudent){
    const student = await CapstoneStudent.findOne({ StudentID: inStudent.studentId }).lean()
    if (student == null) {
        return false
    } else {
        return true
    }
}

function createValidStudent(inStudent)
{
    if (!inStudent.email.includes("@"))
    {
        console.log("invalid email")
        throw TypeError
    }
    if (inStudent.studentId.length != 8)
    {
        console.log("invalid id")
        throw TypeError
    }
    if (inStudent.unit == [])
    {
        console.log("no unit selected")
        throw TypeError
    }
    //console.log(Object.values(inStudent))
    //console.log(Object.keys(inStudent))
    //console.log(Object.hasOwn(inStudent, "email"));
    
    const mongooseStudent = 
    {
        Email: inStudent.email,
        Group: '0', //for all students Group 0 means no group
        Name: inStudent.firstName + ' ' + inStudent.lastName,
        Password: 'Password1',//TODO: randomly generate passwords
        StudentID: inStudent.studentId,
        TermsAccepted: 0,
        Unit: inStudent.unit[0], //the unit is given as a list, but we don't need a list, just 1 unit
        Major: inStudent.unit[0], 
        CWA: inStudent.CWA,
        Username: inStudent.studentId, //the username needs to be unique. idk if using the student ID is good longterm, but it helps shortterm
        Salt: 'idk' //I dont understand the salt other than it helps keep passwords safe. we don't need to set it properly yet
    }
    return mongooseStudent
}



ucBackend.get('/api/getWorkProjectApplications', async (req, res) => {
    const project = JSON.parse(res.body)

    //grab all student applications for the project the frontend chooses
    const applications = await ProjectApplication.find({Project: project.Name}).lean()
    const applicationsFilePath = 'applications/' + project.Name

    try {
        //try to make a new folder for this set of applications
        if (!fs.existsSync(applicationsFilePath)) {
            fs.mkdirSync(applicationsFilePath)
        } else { 
            //we get here if the file already exists. This is fine, it just means this is the second time the UC has tried to download this
            //this just means we need to delete the old before making the new
            fs.rm(applicationsFilePath, { recursive: true, force: true })
            fs.mkdirSync(applicationsFilePath)
        }

    } catch (err) {
        console.error(err)
    }

    
    //loop through all student aplications for this project
    applications.forEach(element => {
        //create's a file for each student, adding their resume and cover letter to the file
        createAStudentFile(element, applicationsFilePath)
    });
    
    //does what it says on the tin
    zipTheFile(applicationsFilePath)
    
    //ask the frontend to download the zip file created
    res.download(applicationsFilePath)
});
    
    
//function that creates a new folder for the student and puts in their resume and Cover Letter
async function createAStudentFile(application, applicationsFilePath){
    const studentsFilePath = applicationsFilePath + application.Student
    try {
        if (!fs.existsSync(studentsFilePath)) {
            fs.mkdirSync(studentsFilePath)
        }
    } catch (err) {
        console.error("folder already exists")
    }
    await fs.writeFile(studentsFilePath + '/' + application.Student + '_Resume.pdf', application.Resume)
    await fs.writeFile(studentsFilePath + '/' + application.Student + '_CoverLetter.pdf', application.CoverLetter)
}


async function zipTheFile(filePathToZip){
    const zip = new AdmZip();
    const outputFile = filePathToZip + ".zip";
    zip.addLocalFolder(filePathToZip);
    zip.writeZip(outputFile);
    console.log(`Created ${outputFile} successfully`);
}





module.exports = ucBackend;

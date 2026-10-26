//currently if you want to run this you can use the command
//    node thisFile'sName
//this program will not fully work without a mongodb to connect to

const express = require("express")
const ucBackend = express.Router();
const mongoose = require("mongoose")
const cors = require ("cors")
const {CapstoneStudent, Group, ProjectApplication, Project, Round} = require ("../models")
const { group } = require("node:console")
const fs = require ("node:fs")
const AdmZip = require("adm-zip");
const { boolean } = require("joi")
const multer = require("multer");
const path = require("node:path");
const verifyStudentSession = require('./auth').verifyStudentSession;
const jwt = require('jsonwebtoken');


const joi = require('joi');

const validationSchemas = {
    saveRoundSchema: joi.object({
        StartDate: joi.date().required(),
        EndDate: joi.date().required(),
    }),
    closeRoundSchema: joi.object({
        RoundNumber: joi.number().required(),
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

    const trueStartDate = new Date(StartDate);
    const trueEndDate = new Date(EndDate);

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

ucBackend.post('/api/EditRound', async (req, res) => {
    const {RoundNumber, StartDate, EndDate} = req.body

    let round = await Round.findOne({RoundNumber: RoundNumber}).exec();

    if (!round) {
        return res.status(404).send('Round does not exist');
    }

    const trueStartDate = new Date(StartDate);
    const trueEndDate = new Date(EndDate);

    if (trueEndDate <= trueStartDate) {
        return res.status(400).send('Start date must precede end date');
    }

    round.StartDate = trueStartDate;
    round.EndDate = trueEndDate;

    await round.save();

    res.status(200).json(round);
});

ucBackend.post('/api/CloseRound', validateBodyParameters(validationSchemas.closeRoundSchema), async (req, res) => {
    const {RoundNumber} = req.body

    let round = await Round.findOne({RoundNumber: RoundNumber}).exec();

    if (!round) {
        return res.status(404).send('Round does not exist');
    }

    const currentDate = new Date();
    let yesterday = new Date();
    yesterday.setDate(currentDate.getDate() - 1)


    const startDate = new Date(round.StartDate);
    const endDate = new Date(round.EndDate);

    if (currentDate < startDate || currentDate > endDate) {
        return res.status(400).send('Round must be open to close it');
    }

    round.EndDate = yesterday;

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

ucBackend.delete('/api/project/:id', async (req, res) => {
    const id = req.params.id;
    const projectToDelete = await Project.findOneAndDelete({ ID: id}).exec();

    if (projectToDelete === null) {
        return res.status(400).json({
            message: "could not find project to delete"
        })
    }

    res.sendStatus(200);
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
            message: exception.message
        }).end()
    }

    //next we see if the student exists in the database already, if they do then we don't want a duplicate of them
    const isInDb = await studentExistsInDB(StudentObject)
    if (isInDb)
    {
        return res.status(401).json({
            message: "Student already exists"
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
    const projects = await Project.find({Type: "Group"}).lean()
    //convert the java object 'students' into a JSON object, then send it to whoever called this.
    res.send(JSON.stringify(projects))
});

ucBackend.get('/api/requestAllWORKProjects', async (req, res) =>{
    const projects = await Project.find({Type: "Work"}).lean()
    //convert the java object 'students' into a JSON object, then send it to whoever called this.
    res.send(JSON.stringify(projects))
});

ucBackend.get('/api/requestAllProjects', async (req, res) =>{
    const groups = await Project.find().lean()
    //convert the java object 'students' into a JSON object, then send it to whoever called this.
    res.send(JSON.stringify(groups))
});

ucBackend.get('/api/requestAllRounds', async (req, res) =>{
    const rounds = await Round.find().lean()
    //convert the java object 'students' into a JSON object, then send it to whoever called this.
    res.send(JSON.stringify(rounds))
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

    const projects = await Project.find().lean()
    
    const newProject = await Project.create({
        ID: String(projects.length + 1),
        Name: inProject.Name,
        Description: inProject.Description,
        Client: inProject.Client,
        Round: inProject.Round,
        ClientEmail: inProject.ClientEmail,
        Type: inProject.Type,
        IntendedSize: inProject.IntendedSize}
    );

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
        message: "groups saved successfully"
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
        throw "Invalid Email"
    }
    if (inStudent.studentId.length != 8)
    {
        console.log("invalid id")
        throw "Invalid ID"
    }
    if (inStudent.unit == [])
    {
        console.log("no unit selected")
        throw "No unit selected"
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
        Unit: inStudent.unit, //the unit is given as a list, but we don't need a list, just 1 unit
        Major: inStudent.course, 
        CWA: inStudent.cwa,
        Username: inStudent.email, //the username needs to be unique. idk if using the student ID is good longterm, but it helps shortterm
        Salt: 'idk' //I dont understand the salt other than it helps keep passwords safe. we don't need to set it properly yet
    }
    return mongooseStudent
}



ucBackend.get('/api/getWorkProjectApplications/:ID', async (req, res) => {
    const projectID = JSON.parse(req.params.ID)
    const project = await Project.findOne({ID: projectID}).lean()
    //grab all student applications for the project the frontend chooses
    const applications = await ProjectApplication.find({Project: projectID}).lean()
    
    const applicationsFilePath = 'applications/' + project.Name
    console.log("file: " + applicationsFilePath)
    try {
        //try to make a new folder for this set of applications
        if (!fs.existsSync(applicationsFilePath)) {
            fs.mkdirSync(applicationsFilePath, {recursive: true})
        } else { 
            //we get here if the file already exists. This is fine, it just means this is the second time the UC has tried to download this
            //this just means we need to delete the old before making the new
            fs.rmSync(applicationsFilePath, {recursive: true, force: true})
            fs.mkdirSync(applicationsFilePath)
        }

    } catch (err) {
        console.error(err)
        console.log("failed making folder for project")
    }

    /*
    //loop through all student aplications for this project
    await applications.forEach(element => {
        //create's a file for each student, adding their resume and cover letter to the file
        await createAStudentFile(element, applicationsFilePath)
    });*/

    for (var i = 0; i < applications.length; i++)
    {
        await createAStudentFile(applications[i], applicationsFilePath)
    }
    
    //does what it says on the tin
    zipTheFile(applicationsFilePath)
    
    //ask the frontend to download the zip file created
    res.download(applicationsFilePath + ".zip")
});
    
    
//function that creates a new folder for the student and puts in their resume and Cover Letter
async function createAStudentFile(application, applicationsFilePath){
    const student = await CapstoneStudent.findOne({StudentID: application.Student}).lean()
    const studentsFilePath = applicationsFilePath + "/" + student.Name
    try {
        if (!fs.existsSync(studentsFilePath)) {
            fs.mkdirSync(studentsFilePath)
        }
    } catch (err) {
        console.error("could not make student file path")
    }
    
    await fs.writeFileSync(studentsFilePath + '/' + student.Name + '_Resume.pdf', application.Resume.data.buffer)
    await fs.writeFileSync(studentsFilePath + '/' + student.Name + '_CoverLetter.pdf', application.CoverLetter.data.buffer)
}


async function zipTheFile(filePathToZip){
    const zip = new AdmZip();
    const outputFile = filePathToZip + ".zip";
    if (fs.existsSync(outputFile)) {
        fs.rmSync(outputFile, {recursive: true, force: true})
    }
    zip.addLocalFolder(filePathToZip);
    console.log(zip.getEntries().length)

    const sourceDir = path.resolve(filePathToZip);
    zip.writeZip(outputFile);
    console.log(`Created ${outputFile} successfully`);
}


ucBackend.get('/api/applicationStatus', async (req, res) => {
    try {
        const { Student, Project } = req.query;

        if (!Student || !Project ) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        const application = await ProjectApplication.findOne({
            Student: Student, Project: Project
        });

        // student has applied
        return res.status(200).json(!!application);
    }
    catch (error) {
        console.error("Unable to get application status: ", error);

        return res.status(500).json({
            message: "Unable to get application status"
        });
    }
});


//this probably should be in a different file, but it's here because I don't want to mess with someone else's file
//takes in a student ID, returns if they have a resume in the db
ucBackend.get('/api/DoesStudentHaveResume', verifyStudentSession, async (req, res) =>{
    const studentID = req.body
    const fullStudent = await CapstoneStudent.findOne({StudentID: studentID}).lean()
    //convert the java object 'students' into a JSON object, then send it to whoever called this.
    if (Object.hasOwn(fullStudent, "Resume"))
    {
        return res.status(200).json({ 
        hasResume: "true"
    }).end()
    } else
    {
        return res.status(201).json({ 
        hasResume: "false"
    }).end()
    }
    
});


const storage = multer.memoryStorage();
const saveLoc = multer({ storage: storage });


ucBackend.post('/api/saveStudentResume', verifyStudentSession, saveLoc.any(), async (req, res) =>{
    
    console.log(req.body)
    console.log(req.files)
    const decodedToken = jwt.verify(req.cookies.token, process.env.WEB_TOKEN_KEY);
    const username = decodedToken.username;
    const student = await CapstoneStudent.findOne({Username: username});
    
    student.Resume = req.files[0].buffer
    student.save()

    return res.status(200).json({ 
        message: "resume saved successfully"
    }).end()
});




module.exports = ucBackend;

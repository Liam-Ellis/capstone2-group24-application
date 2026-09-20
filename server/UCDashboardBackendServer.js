//currently if you want to run this you can use the command
//    node thisFile'sName
//this program will not fully work without a mongodb to connect to

const express = require("express")
const mongoose = require("mongoose")
const cors = require ("cors")
const {CapstoneStudent, Group, ProjectApplication} = require ("../models")
const GroupWorkProjects = require ("../models/Project.js")
const { group } = require("node:console")
const fs = require ("node:fs")
const AdmZip = require("adm-zip");
const { boolean } = require("joi")



const app = express()
const PORT = 50000    
const DATABASE_PATH = "mongodb://liam_db_user:LiamPassword@ac-h3febtm-shard-00-00.17jnurt.mongodb.net:27017,ac-h3febtm-shard-00-01.17jnurt.mongodb.net:27017,ac-h3febtm-shard-00-02.17jnurt.mongodb.net:27017/?ssl=true&replicaSet=atlas-12gxsl-shard-0&authSource=admin&appName=Capstone24"
mongoose.connect(DATABASE_PATH, {dbName: 'ccp24'});

app.use(
    cors({
        origin: ["http://localhost:5173"],
    })
)

app.use(express.json());

//not fully sure how neccessary this is
app.get('/', (req, res) => {
    res.send("welcome to this webpage")
});

app.listen(PORT, () => {
    console.log(`app is running on http://localhost:${PORT}`);
});


//1. this will not work without a mongodb database on your computer, in this case mine is localhosted with a db named test
//2. currently this code just returns the UC's name, a proof of concept for any data that we may need to pull from the db.
//3. this is not very secure as anybody requesting the right URI could trigger this. Security will need to be figured out later.
app.get('/api/getUC', async (req, res) => {
    const uc = await ucAccounts.findOne()
    res.send(uc.name)
});


//test for getting things from database. not for final product
//http://localhost:50000/api/test_request_UCs
app.get('/api/test_GET_UCs', async (req, res) => {
    
    const uc = await ucAccounts.find().lean()
    //convert the java object 'uc' into a JSON object, then send it to whoever called this.
    res.send(JSON.stringify(uc))
});

//
app.post('/api/POST_student', async (req, res) => {
    console.log(req.body)
    //const StudentObject = JSON.parse(req.body)
    const StudentObject = req.body
    let studentDBModel = null;
    try
    {
    //check to see if the student is valid
    //theoretically this chould never occur as it would be nice to have validation on the frontend rather than the backend
        studentDBModel = createValidStudent(StudentObject)
        console.log(studentDBModel)
            
    } catch (exception)
    {
        console.log("student failed to save, was invalid")
        //a lot of different probalems can get us here, but most of them are just the user inputting an invalid student
        if (exception instanceof TypeError)
        {
            return res.status(400).json({
                message: "object given was not a valid student"
            }).end()
        }
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
    console.log("yipee")
    return res.status(200).json({ 
        message: "Data received successfully"
    }).end()
    
});

app.get('/api/requestAllStudents', async (req, res) => {
    const students = await CapstoneStudent.find().lean()
    //convert the java object 'students' into a JSON object, then send it to whoever called this.
    res.send(JSON.stringify(students))
});

app.get('/api/requestAllGroups', async (req, res) =>{
    const groups = await Group.find().lean()
    //convert the java object 'students' into a JSON object, then send it to whoever called this.
    res.send(JSON.stringify(groups))
});

app.get('/api/requestAllProjects', async (req, res) =>{
    const groups = await Project.find().lean()
    //convert the java object 'students' into a JSON object, then send it to whoever called this.
    res.send(JSON.stringify(groups))
});


//saves any edits to projects. mostly commented out as this needs some changes, as to edit a project it needs an identifyer 
//but the only identifyer currently is the project's name. This means the UC could theoretically edit the name, which would make it impossible find 
//the correct project to save over. 
//the solution here is to add some form of ID that the UC can't edit, although that means changing the schema, which I need to discuss with the team.
app.post('/api/SaveEditedProject', async (req, res) => {
    const inProject = JSON.parse(req.body)
    /*const projectToEdit = await Project.findOne({ ProjectID: inProject.ProjectID})

    if (projectToEdit == null) {
        return res.status(400).json({
            message: "could not find project to edit"
        }).end()
        return
    }

    projectToEdit.Type =  inProject.Type
    projectToEdit.Round =  inProject.Round
    projectToEdit.Name =  inProject.Name
    projectToEdit.Description =  inProject.Description
    projectToEdit.IntendedSize =  inProject.IntendedSize
    projectToEdit.save()

    res.status(200).json({ 
        message: "project edited successfully"
    }).end()
    */
});

/* not neccessary
app.get('/api/requestStudentsApplyingForProject', async (req, res) =>{
    const groupToEdit = await Group.find({})
    //convert the java object 'students' into a JSON object, then send it to whoever called this.
    res.send(JSON.stringify(groups))
});
*/

app.post('/api/SaveGroups', async (req, res) => {
    //this makes the assumption that the groups are sent as an array of JSONs
    const groups = JSON.parse(req.body)
    
    //loop through every group sent in by the frontend
    for (let i = 0; i < groups.length; i++) {

        //check to see if this group exists in the database already
        const groupToEdit = await Group.findOne({GroupNumber: groups[i].GroupNumber})
        //if this group doesn't exist in the database yet
        if (groupToEdit == null){
            const newGroup = new Group(groups[i])
            newGroup.save()
        } else {//if this group already exists in the database
            groupToEdit.Confirmed = groups[1].Confirmed
            groupToEdit.Project = groups[1].Project
            groupToEdit.Reason = groups[1].Reason
            groupToEdit.Students = groups[1].Students
        }
    };
    
});

app.post('/api/SaveStudentGroups', async (req, res) => {
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
    //if any of the data points given are invalid we throw an error
    /*
    if (!inStudent.Email.includes("@"))
    {
        throw TypeError
    }
    if (inStudent.length != 8)
    {
        throw TypeError
    }*/
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
        Unit: inStudent.unit[0], //the unit is a list, we don't need to fuck with that rn
        Username: inStudent.studentId, //the username needs to be unique. idk if using the student ID is good longterm, but it helps shortterm
        Salt: 'idk' //I dont understand the salt other than it helps keep passwords safe. we don't need to set it properly yet
    }
    return mongooseStudent
}



app.get('/api/getWorkProjectApplications', async (req, res) => {
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

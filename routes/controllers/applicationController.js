const {CapstoneStudent, Round, ProjectApplication} = require ("../../models")

const jwt = require('jsonwebtoken');

//the body of this needs the coverletter, the project type and the project ID
const uploadApplication = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }
        
        const decodedToken = jwt.verify(req.cookies.token, process.env.WEB_TOKEN_KEY);
        const username = decodedToken.username;

        //currently working off ID, maybe should work off name
        const student = await CapstoneStudent.findOne({Username: username}).lean();
        
        //theoretically we should never get here, the frontend should be logged in as a student and if this is null that means the student logged in doesn't exist
        if (student === null)
        {
            res.status(401).json({
                message: "student doesn't exist in db",
            });
        }
        
        if (req.body.Type.toUpperCase() === 'WORK' &&
            (!req.body.file || !student.Resume)) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        const application = await ProjectApplication.create({
            CoverLetter: req.body.file,
            Type: req.body.Type,
            Student: student.ID,
            Project: req.body.ID,
            Resume: student.Resume
        });

        res.status(201).json({
            message: "Application submitted successfully!",
        });
    }
    catch (err) {
        console.error("Unable to save application: ", err);
        res.status(500).json({
            message: "Unable to save application!"
        });
    }
}


//needs a studentID and the id of the project the application is applying to in the body
//majorly reworked this one, it used to check the Round Model amelia made and see if the round had been applied to at all
const getApplicationStatus = async (req, res) => {
    try {
        


        


        const application = await ProjectApplication.findOne({
            Student: req.body.ID,
            Project: req.body.Project 
        });

        // round opened but student has not applied
        if (!application) {
            return res.json({
                status: "NOT_APPLIED"
            });
        }

        // student has applied
        return res.json({
            status: "ALREADY_APPLIED"
        });
    }
    catch (error) {
        console.error("Unable to get application status: ", error);

        res.status(500).json({
            message: "Unable to get application status"
        });
    }
};

module.exports = { uploadApplication, getApplicationStatus };

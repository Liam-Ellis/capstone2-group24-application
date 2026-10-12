const {CapstoneStudent, Round, ProjectApplication} = require ("../../models")

const uploadApplication = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }
        
        //currently working off ID, maybe should work off name
        const student = await CapstoneStudent.find({ID: req.Student}).lean()
        
        //theoretically we should never get here, the frontend should be logged in as a student and if this is null that means the student logged in doesn't exist
        if (student == null)
        {
            res.status(401).json({
            message: "student doesn't exist in db",
            status: application.status
        });
        }

        

        const application = await Application.create({
            CoverLetter: req.file,
            Type: req.Type,
            //students ID
            Student: req.Student,
            Project: req.ProjectName,
            Resume: student.Resume
        });

        res.status(201).json({
            message: "Application submitted successfully!",
            status: application.status
        });
    }
    catch (err) {
        console.error("Unable to save application: ", err);
        res.status(500).json({
            message: "Unable to save application!"
        });
    }
}


//needs a studentID in the body
//major reqork, Amelia had assumed that you apply to rounds and not projects
const getApplicationStatus = async (req, res) => {
    try {
        const studentID = req.body


        const currentDate = new Date()
        // find if round is open
        const round = await Round.findOne({
            StartDate: { $lt: currentDate},
            EndDate: { $gte: currentDate}
        });

        //if we couldn't find one then no round is open
        if (!round) {
            return res.json({
                status: "CLOSED"
            });
        }

        const application = await Application.findOne();

        // round opened but student has not applied
        if (!application) {
            return res.json({
                status: "NOT_APPLIED"
            });
        }

        // student has applied
        return res.json({
            status: application.status
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

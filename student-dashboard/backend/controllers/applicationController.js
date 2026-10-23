const Application = require("../models/ProjectApplication.js");
const Round = require("../models/Round.js");

const uploadApplication = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        const { Student, Project, Type } = req.body;
    
        if (!Student || !Project || !Type ) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }
        
        const application = await Application.create({
            Student,
            Project,
            Type,
            Resume: req.file.filename,
            Status: "APPLIED"
        });

        res.status(201).json({
            message: "Application submitted successfully!",
            status: application.Status
        });
    }
    catch (err) {
        console.error("Unable to save application: ", err);
        res.status(500).json({
            message: "Unable to save application!"
        });
    }
}

const getApplicationStatus = async (req, res) => {
    try {
        const { Student, Project } = req.query;

        if (!Student || !Project ) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        const application = await Application.findOne({
            Student: Student,
            Project: Project
        });

        // round opened but student has not applied
        if (!application) {
            return res.status(200).json({
                applied: false,
                message: "Not Applied"
            });
        }

        // student has applied
        return res.status(200).json({
            applied: true,
            message: "Applied",
            status: application.Status
        });
    }
    catch (error) {
        console.error("Unable to get application status: ", error);

        return res.status(500).json({
            message: "Unable to get application status"
        });
    }
};

module.exports = { uploadApplication, getApplicationStatus };

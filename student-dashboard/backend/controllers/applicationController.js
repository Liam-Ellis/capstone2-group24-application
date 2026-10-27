const Application = require("../models/ProjectApplication.js");

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
        
        if (!["Resume", "CoverLetter"].includes(Type)) {
            return res.status(400).json({
                message: "Type must be either Resume or Cover Letter"
            });
        }

        await Application.create({
            Student, 
            Project, 
            Type,
            [Type]: req.file.buffer
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

const getApplicationStatus = async (req, res) => {
    try {
        const { Student, Project } = req.query;

        if (!Student || !Project ) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        const application = await Application.findOne({
            Student, Project
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
};

module.exports = { uploadApplication, getApplicationStatus };

const Application = require("../models/ProjectApplication.js");
const Round = require("../models/Round.js");

const uploadApplication = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }
        
        const application = await Application.create({
            document: req.file.filename,
            status: "APPLIED"
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

const getApplicationStatus = async (req, res) => {
    try {
        // find if round is open
        const round = await Round.findOne({
            status: "OPEN"
        });

        if (!round) {
            return res.json({
                applied: false,
                message: "Not Applied"
            });
        }

        const application = await Application.findOne();

        // round opened but student has not applied
        if (!application) {
            return res.json({
                applied: false,
                message: "Not Applied"
            });
        }

        // student has applied
        return res.json({
            applied: true,
            message: "Applied"
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

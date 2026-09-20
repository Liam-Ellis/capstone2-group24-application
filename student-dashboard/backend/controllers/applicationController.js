const Application = require("../models/ApplicationModel.js");

const uploadApplication = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        const application = new Application({
            fileName: req.file.originalname,
            filePath: req.file.path
        });

        await application.save();

        res.status(201).json({
            message: "Application submitted successfully!"
        });

    }
    catch (err) {
        console.error("Unable to save application: ", err);
        res.status(500).json({
            message: "Unable to save application!"
        });
    }
}

module.exports = { uploadApplication };

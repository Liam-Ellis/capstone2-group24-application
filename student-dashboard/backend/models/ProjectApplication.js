const mongoose = require("mongoose");

const ProjectApplicationSchema = new mongoose.Schema({
    Student: {
        type: String,
        required: true
    },
    Project: {
        type: String,
        required: true
    },
    Type: {
        type: String,
        required: true
    },
    Resume: {
        type: Buffer
    },
    CoverLetter: {
        type: Buffer
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('project_application', ProjectApplicationSchema);

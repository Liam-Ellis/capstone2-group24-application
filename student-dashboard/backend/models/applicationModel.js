const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    document: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [
            "NOT_APPLIED",
            "APPLIED",
            "SUCCESSFUL",
            "UNSUCCESSFUL"
        ],
        default: "NOT_APPLIED"
    }
});

module.exports = mongoose.model('Application', applicationSchema);

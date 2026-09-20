const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    }, 
    filePath: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);

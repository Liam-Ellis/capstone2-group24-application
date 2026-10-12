const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema({
    name: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["OPEN","CLOSED"],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Round', roundSchema);
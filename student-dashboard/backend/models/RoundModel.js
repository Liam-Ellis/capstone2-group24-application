const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema({
    RoundNumber: {
        type: Number,
        required: true,
    },
    StartDate: {
        type: Date,
        required: true
    },
    EndDate: {
        type: Date,
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('round', roundSchema);
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    round: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Round',
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
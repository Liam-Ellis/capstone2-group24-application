const mongoose = require("mongoose");

const preferenceSchema = new mongoose.Schema({
    studentId: {
        type: Number,
        unique: true,
        required: true
    },
    fullName: {
        type: String,
        trim: true,
        required: true
    },
    CWA: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    emailNotifications: {
        type: String,
        enum: ["Yes", "No"],
        default: "Yes"
    },
    major: {
        type: String,
        required: true
    },
    pref1: {
        type: String,
        default: ""
    },
    pref2: {
        type: String,
        default: ""
    },
    pref3: {
        type: String,
        default: ""
    },
    pref4: {
        type: String,
        default: ""
    },
    pref5: {
        type: String,
        default: ""
    },
    dislikePref1: {
        type: String,
        default: ""
    },
    dislikePref2: {
        type: String,
        default: ""
    },
    dislikePref3: {
        type: String,
        default: ""
    },
    dislikePref4: {
        type: String,
        default: ""
    },
    dislikePref5: {
        type: String,
        default: ""
    },
},
{
    timestamps: true
});

module.exports = mongoose.model('Preference', preferenceSchema);
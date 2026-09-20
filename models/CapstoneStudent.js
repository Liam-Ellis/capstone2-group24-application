const mongoose = require('mongoose');

const CapstoneStudentSchema = new mongoose.Schema({
    Email: {
        type: String,
        required: true,
    },

    Group: {
        type: Number,
        default: 0,
    },

    Name: {
        type: String,
        required: true,
    },

    Password: {
        type: String,
        required: true,
    },

    PreferenceAgainst: {
        type: [String],
        default: [],
    },

    PreferenceFor: {
        type: [String],
        default: [],
    },

    Resume: {
        type: Buffer,
    },

    StudentID: {
        type: String,
        required: true,
    },

    TermsAccepted: {
        type: Number,
        required: true,
    },

    Unit: {
        type: String,
        required: true,
    },

    Username: {
        type: String,
        required: true,
    },

    Salt: {
        type: String,
        required: true,
    },

    OTP: {
        type: String,
        required: false,
    },

    emailVerified: {
        type: Boolean,
        required: false,
    }
}, { timestamps: true });

const CapstoneStudent = mongoose.model("capstone_student", CapstoneStudentSchema);

module.exports = CapstoneStudent;
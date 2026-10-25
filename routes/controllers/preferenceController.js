const Preference = require("../models/PreferenceModel.js");

const getPreference = async (req, res) => {
    try {
        const { studentId } = req.params;

        const preference = await Preference.findOne({ studentId });

        if (!preference) {
            return res.status(404).json({message: "No preferences found!"});
        }
        res.status(200).json(preference);

    }
    catch (err) {
        console.error("Unable to get preferences, error: ", err);

        res.status(500).json({message: "Unable to get preferences " });

    }
};

const savePreference = async (req, res) => {
    try {
        const {
            studentId, 
            fullName,
            CWA, 
            emailNotifications,
            major,
            pref1,
            pref2,
            pref3,
            pref4,
            pref5,
            dislikePref1,
            dislikePref2,
            dislikePref3,
            dislikePref4,
            dislikePref5
        } = req.body;

        // check if student has already submitted preferences
        const exisitngPreference = await Preference.findOne({ studentId });
        if (exisitngPreference) {
            return res.status(409).json({
                message: "Student has submitted for the second time"
            });

        }

        const preference = new Preference({
            studentId, 
            fullName,
            CWA, 
            emailNotification,
            major,
            pref1,
            pref2,
            pref3,
            pref4,
            pref5,
            dislikePref1,
            dislikePref2,
            dislikePref3,
            dislikePref4,
            dislikePref5
        });

        await preference.save();

        res.status(201).json({
            message: "Preferences saved succesfully.", preference
        });

    }
    catch (err) {
        console.error("Unable to save preferences, error: ", err);

        res.status(500).json({
            message: "Unable to save preferences."
        });
    }
};


module.exports = { 
    getPreference,
    savePreference };

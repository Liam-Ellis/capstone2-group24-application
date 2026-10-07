const express = require("express");

const router = express.Router();

const { 
    savePreference,
    getPreference
} = require("../controllers/preferenceController");

// submit student preference
router.post("/", savePreference);

// get preference for one student
router.get("/:studentId", getPreference);

module.exports = router;

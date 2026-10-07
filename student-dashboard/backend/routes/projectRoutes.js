const express = require("express");
const router = express.Router();

const {
    getProjectsByRound, 
    getSelectedProject } = require("../controllers/projectController");

// get all projects 
router.get("/round/:roundId", getProjectsByRound);

// get project by id
router.get("/:projectId", getSelectedProject);

module.exports = router;
const Project = require("../models/projectModel.js");

// get projects for a specific round
const getProjectsByRound = async (req, res) => {
    try {
        const { roundId } = req.params;
        const project = await Project.find({
            round: roundId
        });

        res.status(200).json(project);
    }
    catch (err) {
        console.error("Unable to get the project: ", err);

        res.status(500).json({ message: "Unable to get the project" });
    }
};

const getSelectedProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId);

        res.status(200).json(project);
    }
    catch (err) {
        console.error("Unable to get the project: ", err);

        res.status(500).json({ message: "Unable to get the project" });
    }
};

module.exports = { getProjectsByRound, getSelectedProject };


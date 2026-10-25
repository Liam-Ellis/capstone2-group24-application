const {Project} = require("../../models");

// get projects for a specific round
// roundID needs to be in the http params and needs to be a number
const getProjectsByRound = async (req, res) => {
    try {
        const { roundId } = req.params;
        const project = await Project.find({
            //there's a decent chance that roundId is a number here and doesn't work
            RoundNumber: roundId
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
        const project = await Project.findOne({ID: projectId}).lean();

        res.status(200).json(project);
    }
    catch (err) {
        console.error("Unable to get the project: ", err);

        res.status(500).json({ message: "Unable to get the project" });
    }
};

module.exports = { getProjectsByRound, getSelectedProject };


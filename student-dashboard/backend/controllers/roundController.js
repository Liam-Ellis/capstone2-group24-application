const Round = require("../models/RoundModel.js");

// get all rounds
const getRounds = async (req, res) => {
    try {
        const rounds = await Round.find().sort({ StartDate: 1 });
        console.log(rounds);
        res.status(200).json(rounds);
    }
    catch (err) {
        console.error("Unable to get the rounds: ", err);

        res.status(500).json({ message: "Unable to get the rounds" });
    }
};

module.exports = { getRounds };

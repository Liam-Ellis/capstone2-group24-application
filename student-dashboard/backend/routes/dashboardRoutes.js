const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: "Dashboard loaded successfully!"
    });

});

module.exports = router;

const express = require("express");
const router = express.Router();

const { uploadApplication } = require("../controllers/applicationController");

router.post("/upload", upload.single("document"), uploadApplication);

module.exports = router;

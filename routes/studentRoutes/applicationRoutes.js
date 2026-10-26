const express = require("express");
const router = express.Router();
const multer = require("multer");

const verifyStudentSession = require('../auth').verifyStudentSession;

const { uploadApplication,
        getApplicationStatus } = require("../controllers/applicationController");

const upload = multer({ dest: "./upload/" });

router.post("/upload", upload.single("document"), verifyStudentSession, uploadApplication);

router.get("/status", getApplicationStatus);

module.exports = router;
 
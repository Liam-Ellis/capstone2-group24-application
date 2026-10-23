const express = require("express");
const router = express.Router();
const multer = require("multer");

const { uploadApplication,
        getApplicationStatus } = require("../controllers/applicationController");

const upload = multer({ dest: "upload/" });

router.post("/upload", upload.single("document"), uploadApplication);

router.get("/status", express.json(), getApplicationStatus);

module.exports = router;
 
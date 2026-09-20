const express = require("express");
const router = express.Router();
const multer = require("multer");

const { uploadApplication } = require("../controllers/applicationController");

const upload = multer({ dest: "upload/" });

router.post("/upload", upload.single("document"), uploadApplication);

module.exports = router;

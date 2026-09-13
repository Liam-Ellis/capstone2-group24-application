// Task CG2P-60: Backend - Add student via CSV [Noel Kapadia]

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({dest: 'uploads/' });

router.post('/upload', upload.single('document'), (req, res) => {

    res.json({message: "Success: File Uploaded."});

});


module.exports = router;


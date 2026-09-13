// Task CG2P-60: Backend - Add student via CSV [Noel Kapadia]
// Code based on 'Express Tutorial Part 4: Routes and controllers' [https://l1nq.com/hy8m88s]
// Code based on 'Uploading and processing CSV files via a REST API' by Kevin van Zonneveld [https://sl1nk.com/ecx8nml]

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

const upload = multer({
    dest: 'uploads/',
    limits: {fileSize: 1024 * 1024 * 5, files: 1, fields: 0},
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'text/csv' || path.extname(file.originalname).toLowerCase() !== '.csv') {
            return cb(Object.assign(new Error('Unsupported file type'), {code: 'UNSUPPORTED_FILE_TYPE' }))
        }
        cb(null, true)
    }
});

router.post('/upload', upload.single('document'), (req, res) => {

    res.json({message: "Success: File Uploaded."});

});


module.exports = router;


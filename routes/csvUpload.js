// Task CG2P-60: Backend - Add student via CSV [Noel Kapadia]
// Code based on 'Express Tutorial Part 4: Routes and controllers' [https://l1nq.com/hy8m88s]
// Code based on 'Uploading and processing CSV files via a REST API' by Kevin van Zonneveld [https://sl1nk.com/ecx8nml]

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const { pipeline } = require("stream/promises");
const CapstoneStudent = require("./models/CapstoneStudent");
const HCIStudent = require("./models/HCIStudent");

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

async function parseCSV(filepath) {
    try {
        const results = []
        await pipeline(
            fs.createReadStream(filepath) ,
            csv({ strict: true, maxRowBytes: 1024 * 1024 }),
            async (rows) => {
                for await (const row of rows) {
                    results.push(row)

                }
            },
        )
        return results
    } finally {
        await fs.promises.unlink(filepath)
    }
}

router.post('/upload', upload.single('document'), (req, res) => {



    res.json({message: "Success: File Uploaded."});

});


module.exports = router;


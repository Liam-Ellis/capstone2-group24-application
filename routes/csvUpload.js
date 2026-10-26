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
const CapstoneStudent = require("../models/CapstoneStudent");
const HCIStudent = require("../models/HCIStudent");

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

const modelsByType = {
    capstone: CapstoneStudent,
    hci: HCIStudent
};

router.post('/upload/:type', upload.single('document'), async (req, res, next) => {
    const Model = modelsByType[req.params.type];

    if (!Model) {
        return res.status(400).json({message: "Unknown Student Type."});
    }
        
    if (!req.file) {
        return res.status(400).json({message: "No File Uploaded."});
    }

    try {

        let rows;
        try {
            rows = await parseCSV(req.file.path);
        } catch (parseError) {
            return res.status(400).json({message: "Invalid CSV file."});
        }
        if (rows.length === 0) {
            return res.status(400).json({message: "CSV file is empty."});
        }

        const transformedRows = rows.map(row => transformRow(row, req.params.type));
        const saved = await Model.insertMany(transformedRows, {ordered: false });
        res.json({
            message: "File Uploaded.",
            recordsSaved: saved.length,
            recordsFailed: transformedRows.length - saved.length
        
        });

    } catch (error) {
        next(error);
    }

});

function transformRow(row, type) {

    if (type === 'capstone') {

        row.StudentID = row.STU_ID;
        row.Name = row.STU_GVN_NM + ' ' + row.STU_FAMILY_NM;
        row.Major = row.AWARD_ON_SSP_1;
        row.CWA = Number(row.CWA);
        row.Username = row.STU_ID;
        row.Password = 'dummyPassword';
        row.Salt = 'dummySalt';
        row.Email = row.STU_ID + '@dummymail.com';
        row.Unit = 'dummyUnit';
        row.TermsAccepted = 0;

        if (row.Group) row.Group = Number(row.Group);
        if (row.TermsAccepted) row.TermsAccepted = Number(row.TermsAccepted);
        if (typeof row.PreferenceFor == 'string') {
            row.PreferenceFor = row.PreferenceFor.split(',').map(s => s.trim());
        }
        if (typeof row.PreferenceAgainst == 'string') {
            row.PreferenceAgainst = row.PreferenceAgainst.split(',').map(s => s.trim());
        }
    }
    return row;
}

router.use((error, req, res, next) => {
    if (res.headersSent) return next(error);

    if (error.code == "UNSUPPORTED_FILE_TYPE") {
        return res.status(415).json({message: 'Sorry, only CSV files are accepted.'});
    }
    if (error instanceof multer.MulterError) {
        const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
        return res.status(status).json({message: 'Upload rejected.'});
    }
    console.error('CSV processing failed:', error);
    res.status(500).json({message: 'Unable to process the upload.'});

});


module.exports = router;


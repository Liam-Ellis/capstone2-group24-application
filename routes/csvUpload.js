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
const randomstring = require('randomstring');
const argon2 = require('argon2');
const Resend = require('resend');
const resend = new Resend.Resend(process.env.RESEND_API_KEY);

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

const sendPasswordEmail = async (to, password) => {
    const { data, error } = await resend.emails.send({
        from: "Dashboard Web App <auth@curtindashboard.tech>",
        to: to,
        subject: "Welcome, here are your details",
        html: `<strong>View your dashboard <a href="http://www.curtindashboard.tech">here</a></strong>
                <br></br><strong>Username:</strong> ${to}
                <br></br><strnog>Password:</strong> ${password}`,
    });

    if (error) {
        throw error;
    }
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

        //const transformedRows = rows.map(row => transformRow(row, req.params.type));
        let transformedRows = [];
        for (const row of rows) {
            let newRow = await transformRow(row, req.params.type);
            transformedRows.push(newRow);
        }

        let saved = [];

        for (const row of transformedRows) {
            let password = row.PlainPassword;
            delete row['PlainPassword'];
            let savedStudent = await Model.insertOne(row);

            await sendPasswordEmail(savedStudent.Email, password);

            saved.push(savedStudent);
        }

        res.json({
            message: "File Uploaded.",
            recordsSaved: saved.length,
            recordsFailed: transformedRows.length - saved.length
        
        });

    } catch (error) {
        next(error);
    }

});

async function transformRow(row, type) {

    if (type === 'capstone') {
        const password = randomstring.generate(12);
        const salt = randomstring.generate(16);
        const securePassword = await argon2.hash(salt + password);

        row.StudentID = row.STU_ID;
        row.Name = row.STU_GVN_NM + ' ' + row.STU_FAMILY_NM;
        row.Major = row.AWARD_ON_SSP_1;
        row.CWA = Number(row.CWA);
        row.Username = row.STU_ID + '@student.curtin.edu.au';
        row.PlainPassword = password;
        row.Password = securePassword;
        row.Salt = salt;
        row.Email = row.STU_ID + '@student.curtin.edu.au';
        row.Unit = 'ISAD3000';
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


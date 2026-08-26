// Task CG2P-61: Backend - Edit and Remove existing students [Noel Kapadia]

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const CapstoneStudent = require("../models/CapstoneStudent.js");
const HCIStudent = require("../models/HCIStudent.js");

// The following enables Capstone Student Edits and Deletion

router.put('/updatebyID/:StudentID', async (req, res) => {
    const update = req.body;

    CapstoneStudent.findOneAndUpdate({StudentID: req.params.StudentID}, update, {new: true, runValidators: true})
    .then((stu) => res.json(stu))
    .catch(err => res.status(400).json({error: err.message}))
    
});

router.delete('/delete/:StudentID', async (req, res) => {
    CapstoneStudent.findOneAndDelete({StudentID: req.params.StudentID})
    .then(stu => {
        res.json({message: 'Student has been removed Successfully'})
    })
    .catch(err => res.status(400).json({error: err.message}))

});

// The following enables HCI Student Edits and Deletion

router.put('/updatebyID/:ID', async (req, res) => {
    const update = req.body;

    HCIStudent.findOneAndUpdate({ID: req.params.ID}, update, {new: true, runValidators: true})
    .then((stu) => res.json(stu))
    .catch(err => res.status(400).json({error: err.message}))
});

router.delete('/delete/:ID', async (req, res) => {
    HCIStudent.findOneAndDelete({ID: req.params.StudentID})
    .then(stu => {
        res.json({message: 'Student has been removed Successfully'})
    })
    .catch(err => res.status(400).json({error: err.message}))

});









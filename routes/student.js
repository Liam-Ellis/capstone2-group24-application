const express = require('express');
const student = express.Router();
const joi = require('joi');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const {
    Project,
    Round,
    CapstoneStudent,
    Group,
} = require("../models/index.js");

const verifyStudentSession = require('./auth').verifyStudentSession;

const validationSchemas = {
    getRoundSchema: joi.object({
        ID: joi.number().required(),
    }),
    getProjectSchema: joi.object({
        ID: joi.string().required(),
    }),
    getProjectsSchema: joi.object({
        round: joi.number().required(),
    }),
};

const validateParameters = (schema, property) => {
    return async (req, res, next) => {
        const { error } = schema.validate(req.params);

        if (error == null) {
            next();
        } else {
            const { details } = error;
            const errorMsg = details.map(error => error.message).join(',');

            res.status(422).json({ message: errorMsg });
        }
    };
};

student.get('/rounds', verifyStudentSession, async (req, res) => {
    const rounds = await Round.find().lean();
    res.status(200).json(rounds);
});

student.get('/round/:ID', validateParameters(validationSchemas.getRoundSchema), verifyStudentSession, async (req, res) => {
    const round = await Round.findOne({ RoundNumber: req.params.ID }).lean();

    if (round === null) {
        res.sendStatus(404);
    } else {
        res.status(200).json(round);
    }
});

student.get('/project/:ID', validateParameters(validationSchemas.getProjectSchema), verifyStudentSession, async (req, res) => {
    const project = await Project.findOne({ ID: req.params.ID }).lean();

    if (project === null) {
        res.sendStatus(404);
    } else {
        delete project['IntendedSize'];

        const decodedToken = jwt.verify(req.cookies.token, process.env.WEB_TOKEN_KEY);
        const username = decodedToken.username;

        const user = await CapstoneStudent.findOne({Username: username}).lean();

        if (user.Group !== 0) {
            const group = await Group.findOne({ GroupNumber: user.Group }).lean();

            if (group === null) {
                delete project['ClientEmail'];
            } 
            else {
                if (group.Project !== project.ID ||
                    group.Confirmed !== 1)
                {
                    delete project['ClientEmail'];
                }
            }
        } else {
            delete project['ClientEmail'];
        }

        delete project['ID'];
        res.status(200).json(project);
    }
});

student.get('/projects/:round', validateParameters(validationSchemas.getProjectsSchema), verifyStudentSession, async (req, res) => {
    const projects = await Project.find({ Round: req.params.round }).lean();
    const round = await Round.findOne({ RoundNumber: req.params.round }).lean();

    if (round === null) {
        res.sendStatus(404);
    }
    else if (projects.length === 0) {
        res.status(200).json(projects);
    }
    else {
        const decodedToken = jwt.verify(req.cookies.token, process.env.WEB_TOKEN_KEY);
        const username = decodedToken.username;
        const user = await CapstoneStudent.findOne({Username: username}).lean();

        let group;

        if (user.Group !== 0) {
            group = await Group.findOne({ GroupNumber: user.Group }).lean();
        }

        projects.forEach((project) => {
            delete project['IntendedSize'];

            if (user.Group === 0) {
                delete project['ClientEmail'];
            } 
            else {
                if (group === null) {
                    delete project['ClientEmail'];
                } 
                else {
                    if (group.Project !== project.ID ||
                        group.Confirmed !== 1)
                    {
                        delete project['ClientEmail'];
                    }
                }
            }

            delete project['ID'];
        });

        res.status(200).json(projects);
    }
});

module.exports = student;
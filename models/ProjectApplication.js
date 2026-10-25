const mongoose = require('mongoose');

const ProjectApplicationSchema = new mongoose.Schema({
  Student: {
    type: String,
    required: true,
  },

  //ID of the project
  Project: {
    type: String,
    required: true,
  },

  Type: {
    type: String,
    required: true,
  },

  Resume: {
    data: Buffer,
    contentType: String
  },

  CoverLetter: {
    data: Buffer,
    contentType: String
  },
}, { timestamps: true });

const ProjectApplication = mongoose.model(
  "project_application",
  ProjectApplicationSchema
);

module.exports = ProjectApplication;
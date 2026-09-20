const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true,
  },

  Type: {
    type: String,
    required: true,
  },

  Round: {
    type: Number,
    required: true,
  },

  Name: {
    type: String,
    required: true,
  },

  Client: {
    type: String,
    required: true,
  },

  ClientEmail: {
    type: String,
    required: true,
  },

  Description: {
    type: String,
    required: true,
  },

  IntendedSize: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Project = mongoose.model("project", ProjectSchema);

module.exports = Project;
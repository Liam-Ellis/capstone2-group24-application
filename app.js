const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require("dotenv").config();

mongoose.connect(process.env.MONGODB_STRING, {dbName: 'test'});
//mongoose.connect(process.env.MONGODB_STRING, {dbName: 'ccp24'});

app.use(express.json());
app.use(cors({
  origin : ['http://localhost:5173', 'https://www.curtindashboard.tech', process.env.FRONTEND_URL],
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const authRoute = require('./routes/auth').router;
const studentRoutes = require('./routes/student');
const studentManagementRoutes = require('./routes/studentManagement');
const ucRoute = require('./routes/UCDashboardBackendServer');
const applicationRoutes = require("./routes/studentRoutes/applicationRoutes");
const roundRoutes = require("./routes/studentRoutes/roundRoutes");
const csvRoutes = require("./routes/csvUpload")

// Use routes
app.use('/auth', authRoute);
app.use('/student', studentRoutes);
app.use('/UC', ucRoute);
app.use("/student/application", applicationRoutes);
app.use("/student/round", roundRoutes);
app.use("/studentManage", studentManagementRoutes);
app.use("/csv", csvRoutes)

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
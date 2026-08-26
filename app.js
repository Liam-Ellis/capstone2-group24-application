require('dotenv').config({ path: './environment.env' });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.DATABASEPATH)
    .then(() => console.log("SUCCESS: Connected to MongoDB Atlas!"))
    .catch((err) => console.error("CONNECTION FAILED:", err.message));

const authRoute = require('./routes/auth');

// Use routes
app.use('/auth', authRoute);

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});

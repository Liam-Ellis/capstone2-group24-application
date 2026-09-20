require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const preferenceRoutes = require("./routes/preferenceRoutes");
const projectRoutes = require("./routes/projectRoutes");
const roundRoutes = require("./routes/roundRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use("/api/preference", preferenceRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/round", roundRoutes);
app.use("/api/application", applicationRoutes);


mongoose
    .connect("mongodb+srv://kohmeiyun06_db_user:Ameliakoh@capstone24.17jnurt.mongodb.net/?appName=Capstone24")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB: ", err));

app.listen(3000, () => {
    console.log("App is listening on port 3000");
});


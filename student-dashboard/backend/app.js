require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const preferenceRoutes = require("./routes/preferenceRoutes");
const projectRoutes = require("./routes/projectRoutes");
//const projectRoutes = require("./routes/")

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use("/api/preferences", preferenceRoutes);
app.use("/api/project", projectRoutes);

mongoose
    .connect("mongodb+srv://kohmeiyun06_db_user:Ameliakoh@capstone24.17jnurt.mongodb.net/?appName=Capstone24")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB: ", err));

app.listen(3000, () => {
    console.log("App is listening on port 3000");
});


require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const dashboardRoutes = require("./routes/dashboardRoutes");
const preferenceRoutes = require("./routes/preferenceRoutes");
const projectRoutes = require("./routes/projectRoutes");
const roundRoutes = require("./routes/roundRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use("/dashboard", dashboardRoutes);
app.use("/api/preference", preferenceRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/round", roundRoutes);
app.use("/api/application", applicationRoutes);


mongoose
    .connect("mongodb://josiahwb_db_user:jXoKctzTOXLOG9cL@ac-h3febtm-shard-00-00.17jnurt.mongodb.net:27017,ac-h3febtm-shard-00-01.17jnurt.mongodb.net:27017,ac-h3febtm-shard-00-02.17jnurt.mongodb.net:27017/?ssl=true&replicaSet=atlas-12gxsl-shard-0&authSource=admin&appName=Capstone24", {dbName: "test"})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB: ", err));

app.listen(3000, () => {
    console.log("App is listening on port 3000");
});


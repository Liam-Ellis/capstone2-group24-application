const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const authRoute = require('./routes/auth');

// Use routes
app.use('/auth', authRoute);

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});

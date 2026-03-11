const express = require('express');
const cookieParser = require("cookie-parser")

const app= express();

app.use(express.json());
app.use(cookieParser());

/* requires all routes here */
const authRouter = require("./routes/auth.route")

/* use all routes here */
app.use("/api/auth", authRouter)

module.exports = app;
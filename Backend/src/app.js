const express = require('express');
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app= express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

/* requires all routes here */
const authRouter = require("./routes/auth.route")
const interviewRouter = require("./routes/interview.route")

/* use all routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

module.exports = app;
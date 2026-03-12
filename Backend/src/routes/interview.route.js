const express = require("express");
const interviewRouter = express.Router();


const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware");
const { file } = require("zod");

/**
 * @route POST /api/interview/generateReport
 * @desc Generate interview report based on candidate's resume, self description and job description
 * @access Private
 */
interviewRouter.post("/",authMiddleware.authUser ,upload.single("resume") ,interviewController.generateReportController)




module.exports = interviewRouter;
const pdfParse = require("pdf-parse");

const {generateInterviewReport} = require("../services/ai.service");
const interviewReportModel = require("../models/report.model")

async function generateReportController(req, res) {

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { selfDescription, jobDescription } = req.body

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })

    res.status(200).json({
        success: true,
        message: "Interview report generated successfully",
        interviewReport
    })
}

module.exports = { generateReportController }
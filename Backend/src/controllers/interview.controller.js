const pdfParse = require("pdf-parse");

const {generateInterviewReport,generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/report.model")


/**
 * @name generateReportController
 * @description Controller function to handle interview report generation
 * @route POST /api/interview/
 * @access Private
 */
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


/**
 * @name getInterviewReportByIdController
 * @description Controller function to get interview report by ID
 * @route GET /api/interview/:interviewId
 * @access Private
 */
async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        success: true,
        message: "Interview report fetched successfully.",
        interviewReport
    })
}

/**
 * @name getAllInterviewReportsController
 * @description Controller function to get all interview reports of the logged in user
 * @route GET /api/interview/
 * @access Private
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        success: true,
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}

/**
 * @name generateResumePdfController 
 * @description Controller function to generate resume PDF based on interview report
 * @route POST /api/interview/generateResumePdf/:interviewId
 * @access Private
 */

async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}



module.exports = { generateReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }
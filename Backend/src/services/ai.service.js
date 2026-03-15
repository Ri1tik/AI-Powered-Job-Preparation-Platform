const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
})

const interviewReportSchema = z.object({
    matchScore: z.number(),
    technicalQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    behavioralQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    skillGaps: z.array(z.object({
        skill: z.string(),
        severity: z.enum(["low", "medium", "high"])
    })),
    preparationPlan: z.array(z.object({
        day: z.number(),
        focus: z.string(),
        tasks: z.array(z.string())
    })),
    title: z.string(),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `
You are an expert technical interview coach.

Analyze the candidate's resume, self description, and job description and generate a structured interview preparation report.

You MUST return a single valid JSON object. No markdown. No code fences. No explanation. Just raw JSON.

The JSON must follow this EXACT structure:

{
  "title": "<job title as string>",
  "matchScore": <number 0-100>,
  "technicalQuestions": [
    { "question": "<string>", "intention": "<string>", "answer": "<string>" },
    { "question": "<string>", "intention": "<string>", "answer": "<string>" },
    { "question": "<string>", "intention": "<string>", "answer": "<string>" },
    { "question": "<string>", "intention": "<string>", "answer": "<string>" },
    { "question": "<string>", "intention": "<string>", "answer": "<string>" },
    { "question": "<string>", "intention": "<string>", "answer": "<string>" }
  ],
  "behavioralQuestions": [
    { "question": "<string>", "intention": "<string>", "answer": "<string>" },
    { "question": "<string>", "intention": "<string>", "answer": "<string>" },
    { "question": "<string>", "intention": "<string>", "answer": "<string>" },
    { "question": "<string>", "intention": "<string>", "answer": "<string>" }
  ],
  "skillGaps": [
    { "skill": "<string>", "severity": "<low|medium|high>" },
    { "skill": "<string>", "severity": "<low|medium|high>" },
    { "skill": "<string>", "severity": "<low|medium|high>" }
  ],
  "preparationPlan": [
    { "day": 1, "focus": "<string>", "tasks": ["<string>", "<string>", "<string>"] },
    { "day": 2, "focus": "<string>", "tasks": ["<string>", "<string>", "<string>"] },
    { "day": 3, "focus": "<string>", "tasks": ["<string>", "<string>", "<string>"] },
    { "day": 4, "focus": "<string>", "tasks": ["<string>", "<string>", "<string>"] },
    { "day": 5, "focus": "<string>", "tasks": ["<string>", "<string>", "<string>"] },
    { "day": 6, "focus": "<string>", "tasks": ["<string>", "<string>", "<string>"] },
    { "day": 7, "focus": "<string>", "tasks": ["<string>", "<string>", "<string>"] }
  ]
}

CRITICAL RULES:
- Every item in technicalQuestions, behavioralQuestions, skillGaps, preparationPlan MUST be an object — NOT a string
- preparationPlan MUST have exactly 7 days
- severity MUST be exactly one of: "low", "medium", "high"
- Do NOT wrap the response in markdown or code blocks
- Return ONLY the JSON object, nothing else

Candidate Resume:
${resume}

Candidate Self Description:
${selfDescription}

Job Description:
${jobDescription}
`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    })

    let rawText = response.text
    if (!rawText) {
        rawText = response.candidates?.[0]?.content?.parts?.[0]?.text
    }

    if (!rawText) {
        throw new Error("Empty response received from Gemini")
    }

    // Strip markdown fences if Gemini adds them anyway
    const cleaned = rawText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim()

    const parsed = JSON.parse(cleaned)

    const validated = interviewReportSchema.safeParse(parsed)

    if (!validated.success) {
        throw new Error("AI returned invalid data structure. Please try again.")
    }

    return validated.data
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"] // needed for some environments
    })
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()
    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const prompt = `
Generate a resume for a candidate with the following details.

You MUST return a single valid JSON object with exactly one field: "html".
No markdown. No code fences. No explanation. Just raw JSON.

{ "html": "<full HTML string of the resume>" }

Resume guidelines:
- Tailor the resume for the given job description
- Highlight the candidate's strengths and relevant experience
- The HTML should be well-formatted, structured, and visually appealing
- Use simple professional styling with subtle colors or font variations
- Content should NOT sound AI-generated — write like a real human resume
- Must be ATS friendly and easily parsable
- Keep it concise — ideally 1 to 2 pages when converted to PDF
- Focus on quality over quantity

Candidate Resume:
${resume}

Candidate Self Description:
${selfDescription}

Job Description:
${jobDescription}
`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    })

    let rawText = response.text
    if (!rawText) {
        rawText = response.candidates?.[0]?.content?.parts?.[0]?.text
    }

    if (!rawText) {
        throw new Error("Empty response received from Gemini")
    }

    const cleaned = rawText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim()

    const jsonContent = JSON.parse(cleaned)

    if (!jsonContent.html || typeof jsonContent.html !== "string") {
        throw new Error("AI did not return valid HTML content for resume")
    }

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
    return pdfBuffer
}

module.exports = { generateInterviewReport, generateResumePdf }
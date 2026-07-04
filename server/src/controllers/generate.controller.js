import { generateResponse } from '../services/claudeService.js'
import { validateGenerateRequest } from '../utils/validateGenerateRequest.js'

// Controller stays thin: validate -> call service -> shape the HTTP
// response. All Claude-specific logic lives in the service layer, all
// task-specific prompt logic lives in prompts/templates.js.
export async function generate(req, res, next) {
  try {
    const { task, language, code } = validateGenerateRequest(req.body)

    const result = await generateResponse({ task, language, code })

    res.status(200).json({ result })
  } catch (err) {
    next(err)
  }
}

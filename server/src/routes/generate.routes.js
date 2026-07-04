import { Router } from 'express'
import { generate } from '../controllers/generate.controller.js'

const router = Router()

// POST /api/generate
router.post('/generate', generate)

export default router

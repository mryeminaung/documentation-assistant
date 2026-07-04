import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from './config/index.js'
import generateRoutes from './routes/generate.routes.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { generateLimiter } from './middleware/rateLimiter.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: config.clientOrigin }))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/generate', generateLimiter)
app.use('/api', generateRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`)
})

const express = require('express')
const app = express()
require('dotenv').config()

const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const fileupload = require('express-fileupload')

const { NOT_FOUND_TEMPLATE_2 } = require('./Helper/response-templates')
const morganLogger = require('./Helper/morgan-logger')
const inputSanitizer = require('./Middleware/inputSanitizer')
const requestLogger = require('./Helper/logger')

// NOTE: Firebase Admin initialization is commented out for now.
// Uncomment when Firebase auth is ready to use.
// const { initializeHobbyCoachFirebase } = require('./Config/hobby-coach-admin')
// initializeHobbyCoachFirebase()
// ─── Global Middleware ──────────────────────────────────────────────────────
app.use(helmet())
app.use(cors())
app.use(morganLogger)
app.use(express.urlencoded({ extended: false, limit: '750mb' }));
app.use(express.json({ limit: '750mb' }));
app.use(requestLogger)
app.use(fileupload())

// Apply compression selectively — skip for SSE streams (FIX #8)
app.use((req, res, next) => {
    if (req.headers.accept === 'text/event-stream') {
        return next()
    }
    compression()(req, res, next)
})

app.use(inputSanitizer)

// ─── Legacy AI Routes (existing, preserved) ─────────────────────────────────
const aiRoute = require('./Routes/aiRoute')
app.use(aiRoute)

// ─── Hobby Coach Routes ─────────────────────────────────────────────────────
const authRoute = require('./Routes/authRoute')
const skillLearningRoute = require('./Routes/skillLearningRoute')
const dashboardRoute = require('./Routes/dashboardRoute')
const leaderboardRoute = require('./Routes/leaderboardRoute')

// ─── User Session Middleware (Anonymous Device UUID Resolution) ──────────────
const { resolveUserSession } = require('./Middleware/authMiddleware')
app.use(resolveUserSession)

app.use(authRoute)
app.use(skillLearningRoute)
app.use(dashboardRoute)
app.use(leaderboardRoute)


// ─── Web App Static & SPA Serving ───────────────────────────────────────────
const path = require('path')
const fs = require('fs')
const publicDir = path.join(__dirname, 'public')
app.use(express.static(publicDir))

// Catch-all route: serves index.html for SPA web routes, or 404 for missing /api/ routes
app.use('*', (req, res) => {
    if (req.originalUrl.startsWith('/api/')) {
        return res.status(404).send(NOT_FOUND_TEMPLATE_2)
    }
    const indexFile = path.join(publicDir, 'index.html')
    if (fs.existsSync(indexFile)) {
        return res.sendFile(indexFile)
    }
    res.status(404).send(NOT_FOUND_TEMPLATE_2)
})

module.exports = app

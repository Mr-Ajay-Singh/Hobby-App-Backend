const express = require('express')
const router = express.Router()
const {
    generateText,
    generateVision,
    generateAudio,
    generateBulk,
    getLogs
} = require('../Controller/aiController')
const AuthService = require('../Service/AuthService')
const { verifyToken } = require('../Middleware/verifyToken')

// ─── AI Generation ────────────────────────────────────────────────────────────
router.post('/api/v1/ai/generate-text', AuthService.verifyToken, generateText)
router.post('/api/v1/ai/generate-vision', AuthService.verifyToken, generateVision)
router.post('/api/v1/ai/generate-audio', AuthService.verifyToken, generateAudio)
router.post('/api/v1/ai/generate-bulk', AuthService.verifyToken, generateBulk)

// ─── Logs / Analytics ─────────────────────────────────────────────────────────
router.get('/api/v1/ai/logs', AuthService.verifyToken, getLogs)

module.exports = router

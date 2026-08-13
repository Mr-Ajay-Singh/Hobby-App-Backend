const express = require('express')
const router = express.Router()
const requireAuth = require('../Middleware/requireAuth')
const { register, login, refresh, me, logout } = require('../Controller/authController')

// ─── Authentication ─────────────────────────────────────────────────────────

// Register/Login use Firebase tokens directly (no requireAuth — it's the auth itself)
router.post('/api/auth/register', register)
router.post('/api/auth/login', login)

// These require an existing internal JWT
router.post('/api/auth/refresh', requireAuth, refresh)
router.get('/api/auth/me', requireAuth, me)
router.post('/api/auth/logout', requireAuth, logout)

module.exports = router

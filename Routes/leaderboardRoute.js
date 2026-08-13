const express = require('express')
const router = express.Router()
const { getLeaderboard } = require('../Controller/leaderboardController')

// ─── Leaderboard Endpoint ─────────────────────────────────────────────────────
router.get('/api/v1/leaderboard', getLeaderboard)

module.exports = router

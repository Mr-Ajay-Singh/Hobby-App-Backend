const express = require('express')
const router = express.Router()
const {
    getDashboardSummary,
    updateHobbySettings,
    getUserHobbiesList,
    enrollNewHobby
} = require('../Controller/dashboardController')

// ─── Unified Dashboard Home Hub Endpoints ─────────────────────────────────────
router.get('/api/v1/dashboard', getDashboardSummary)
router.get('/api/v1/dashboard/hobbies', getUserHobbiesList)
router.post('/api/v1/dashboard/settings', updateHobbySettings)
router.post('/api/v1/dashboard/enroll', enrollNewHobby)

module.exports = router

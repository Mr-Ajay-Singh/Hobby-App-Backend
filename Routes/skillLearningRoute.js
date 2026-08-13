const express = require('express')
const router = express.Router()
const {
    learnSkill,
    getConversationMessages,
    submitQuizAnswer,
    completeTask
} = require('../Controller/skillLearningController')

// ─── Single Unified Skill Learning Chatbot Endpoint ───────────────────────────
router.post('/api/v1/ai/learn-skill', learnSkill)

// ─── Paced Quiz & Assignment Progression Endpoints ────────────────────────────
router.post('/api/v1/ai/submit-quiz', submitQuizAnswer)
router.post('/api/v1/ai/complete-task', completeTask)

// ─── User Chat History Endpoint (No ID needed) ────────────────────────────────
router.get('/api/v1/ai/chat-history', getConversationMessages)

// ─── Specific Conversation History Endpoint ───────────────────────────────────
router.get('/api/v1/ai/conversations/:conversationId/messages', getConversationMessages)

module.exports = router

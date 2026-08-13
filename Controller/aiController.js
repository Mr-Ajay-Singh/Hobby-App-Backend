const { generateAiResponse } = require('../Service/AiModelService')
const AiRequestLog = require('../Models/AIRequest')
const { sendResponse } = require('../Middleware/sendResponse')

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Extract uid from verified JWT if available.
 */
function getUid(req) {
    return req.user?.uid || req.body?.uid || ''
}

/**
 * Get the package name from request headers.
 */
function getPackageName(req) {
    return req.headers['x-package-name'] || ''
}

/**
 * Get the platform from request headers.
 * Defaults to 'android' if empty or not 'ios'.
 */
function getPlatform(req) {
    const platform = req.headers['x-platform'] || ''
    return platform.toLowerCase() === 'ios' ? 'ios' : 'android'
}

/**
 * Saves an AiRequestLog entry and returns its _id.
 */
async function createLog(data) {
    try {
        const log = await AiRequestLog.create(data)
        return log._id.toString()
    } catch (err) {
        console.error('Failed to create AiRequestLog:', err.message)
        return null
    }
}

/**
 * Updates an existing AiRequestLog entry.
 */
async function updateLog(logId, data) {
    try {
        if (!logId) return
        await AiRequestLog.findByIdAndUpdate(logId, { $set: data })
    } catch (err) {
        console.error('Failed to update AiRequestLog:', err.message)
    }
}

// ─── POST /api/v1/ai/generate-text ──────────────────────────────────────────

/**
 * Simple text prompt generation.
 * Body: { model, prompt, systemInstruction?, temperature?, modelVariant? }
 */
exports.generateText = async (req, res) => {
    const startTime = Date.now()
    const packageName = getPackageName(req)
    const platform = getPlatform(req)
    console.log(`[AI] generateText: package=${packageName}, platform=${platform}`)

    try {
        const { model, prompt, systemInstruction, temperature, modelVariant } = req.body

        if (!model) return sendResponse(res, 400, { info: 'model is required ("gemini" or "chatgpt")' })
        if (!prompt) return sendResponse(res, 400, { info: 'prompt is required' })

        // Create log entry (pending)
        const logId = await createLog({
            uid: getUid(req),
            packageName,
            platform,
            type: 'text',
            model,
            modelVariant: modelVariant || '',
            prompt,
            systemInstruction: systemInstruction || '',
            status: 'pending'
        })

        // Call AI
        const result = await generateAiResponse({
            model,
            type: 'text',
            prompt,
            systemInstruction,
            temperature,
            modelVariant
        })

        const latencyMs = Date.now() - startTime

        // Update log with response
        await updateLog(logId, {
            responseText: result.text,
            responseModel: result.model,
            status: 'success',
            latencyMs,
            promptTokens: result.usage?.prompt_tokens || 0,
            completionTokens: result.usage?.completion_tokens || 0,
            totalTokens: result.usage?.total_tokens || 0
        })

        return sendResponse(res, 200, {
            info: 'Success',
            text: result.text,
            model: result.model,
            provider: result.provider,
            logId
        })
    } catch (err) {
        const latencyMs = Date.now() - startTime

        // Try to log the error
        await createLog({
            uid: getUid(req),
            packageName,
            platform,
            type: 'text',
            model: req.body?.model || 'unknown',
            modelVariant: req.body?.modelVariant || '',
            prompt: req.body?.prompt || '',
            systemInstruction: req.body?.systemInstruction || '',
            status: 'error',
            errorMessage: err.message || 'Unknown error',
            latencyMs
        })

        return sendResponse(res, 500, { info: `AI generation failed: ${err.message}` }, err)
    }
}

// ─── POST /api/v1/ai/generate-vision ────────────────────────────────────────

/**
 * Image + text prompt generation. Supports BOTH:
 *  - Method A: Base64 in JSON body  → req.body.image = { base64, mimeType }
 *  - Method B: File upload via multipart/form-data → req.files.image
 *
 * Body: { model, prompt, image?, systemInstruction?, temperature?, modelVariant? }
 */
exports.generateVision = async (req, res) => {
    const startTime = Date.now()
    const packageName = getPackageName(req)
    const platform = getPlatform(req)
    console.log(`[AI] generateVision: package=${packageName}, platform=${platform}`)

    try {
        const { model, prompt, systemInstruction, temperature, modelVariant } = req.body

        if (!model) return sendResponse(res, 400, { info: 'model is required ("gemini" or "chatgpt")' })
        if (!prompt) return sendResponse(res, 400, { info: 'prompt is required' })

        // ── Resolve image data (supports both methods) ──
        let imageData = null

        if (req.body.image && req.body.image.base64) {
            // Method A: Base64 in JSON body
            imageData = {
                base64: req.body.image.base64,
                mimeType: req.body.image.mimeType || 'image/jpeg'
            }
        } else if (req.files && req.files.image) {
            // Method B: File upload via multipart/form-data
            const file = req.files.image

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
            if (!allowedTypes.includes(file.mimetype)) {
                return sendResponse(res, 400, { info: 'Invalid image type. Only JPEG, PNG, and WebP are allowed.' })
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                return sendResponse(res, 400, { info: 'Image too large. Maximum 10MB allowed.' })
            }

            imageData = {
                base64: file.data.toString('base64'),
                mimeType: file.mimetype
            }
        }

        if (!imageData) {
            return sendResponse(res, 400, { info: 'Image is required. Send as JSON { image: { base64, mimeType } } or as a file upload.' })
        }

        // Create log entry (pending) — we don't store the base64 image data in the log
        const logId = await createLog({
            uid: getUid(req),
            packageName,
            platform,
            type: 'vision',
            model,
            modelVariant: modelVariant || '',
            prompt,
            systemInstruction: systemInstruction || '',
            hasImage: true,
            imageMimeType: imageData.mimeType,
            status: 'pending'
        })

        // Call AI
        const result = await generateAiResponse({
            model,
            type: 'vision',
            prompt,
            systemInstruction,
            image: imageData,
            temperature,
            modelVariant
        })

        const latencyMs = Date.now() - startTime

        // Update log with response
        await updateLog(logId, {
            responseText: result.text,
            responseModel: result.model,
            status: 'success',
            latencyMs,
            promptTokens: result.usage?.prompt_tokens || 0,
            completionTokens: result.usage?.completion_tokens || 0,
            totalTokens: result.usage?.total_tokens || 0
        })

        return sendResponse(res, 200, {
            info: 'Success',
            text: result.text,
            model: result.model,
            provider: result.provider,
            logId
        })
    } catch (err) {
        const latencyMs = Date.now() - startTime

        await createLog({
            uid: getUid(req),
            packageName,
            platform,
            type: 'vision',
            model: req.body?.model || 'unknown',
            modelVariant: req.body?.modelVariant || '',
            prompt: req.body?.prompt || '',
            systemInstruction: req.body?.systemInstruction || '',
            hasImage: true,
            status: 'error',
            errorMessage: err.message || 'Unknown error',
            latencyMs
        })

        return sendResponse(res, 500, { info: `AI vision generation failed: ${err.message}` }, err)
    }
}

// ─── POST /api/v1/ai/generate-audio ────────────────────────────────────────

/**
 * Audio + text prompt generation. Supports BOTH:
 *  - Method A: Base64 in JSON body  → req.body.audio = { base64, mimeType }
 *  - Method B: File upload via multipart/form-data → req.files.audio
 *
 * Body: { model, prompt, audio?, systemInstruction?, temperature?, modelVariant? }
 */
exports.generateAudio = async (req, res) => {
    const startTime = Date.now()
    const packageName = getPackageName(req)
    const platform = getPlatform(req)
    console.log(`[AI] generateAudio: package=${packageName}, platform=${platform}`)

    try {
        const { model, prompt, systemInstruction, temperature, modelVariant } = req.body

        if (!model) return sendResponse(res, 400, { info: 'model is required ("gemini" or "chatgpt")' })
        if (!prompt) return sendResponse(res, 400, { info: 'prompt is required' })

        // ── Resolve audio data (supports both methods) ──
        let audioData = null

        if (req.body.audio && req.body.audio.base64) {
            // Method A: Base64 in JSON body

            // Check approx size of base64 (base64 is ~4/3 of original size)
            const approxSize = (req.body.audio.base64.length * 3) / 4
            if (approxSize > 10 * 1024 * 1024) {
                return sendResponse(res, 400, { info: 'Audio too large. Maximum 10MB (approx 1 minute) allowed.' })
            }

            audioData = {
                base64: req.body.audio.base64,
                mimeType: req.body.audio.mimeType || 'audio/aac'
            }
        } else if (req.files && req.files.audio) {
            // Method B: File upload via multipart/form-data
            const file = req.files.audio

            // Validate file type
            const allowedTypes = ['audio/aac', 'audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/ogg', 'audio/webm']
            if (!allowedTypes.includes(file.mimetype)) {
                return sendResponse(res, 400, { info: 'Invalid audio type. Common formats like AAC, MP3, WAV, M4A are allowed.' })
            }

            // Validate file size (max 10MB - approx 1 min of high quality audio)
            if (file.size > 10 * 1024 * 1024) {
                return sendResponse(res, 400, { info: 'Audio too large. Maximum 10MB (approx 1 minute) allowed.' })
            }

            audioData = {
                base64: file.data.toString('base64'),
                mimeType: file.mimetype
            }
        }

        if (!audioData) {
            return sendResponse(res, 400, { info: 'Audio is required. Send as JSON { audio: { base64, mimeType } } or as a file upload.' })
        }

        // Create log entry (pending)
        const logId = await createLog({
            uid: getUid(req),
            packageName,
            platform,
            type: 'audio',
            model,
            modelVariant: modelVariant || '',
            prompt,
            systemInstruction: systemInstruction || '',
            status: 'pending'
        })

        // Call AI
        const result = await generateAiResponse({
            model,
            type: 'audio',
            prompt,
            systemInstruction,
            audio: audioData,
            temperature,
            modelVariant
        })

        const latencyMs = Date.now() - startTime

        // Update log with response
        await updateLog(logId, {
            responseText: result.text,
            responseModel: result.model,
            status: 'success',
            latencyMs,
            promptTokens: result.usage?.prompt_tokens || 0,
            completionTokens: result.usage?.completion_tokens || 0,
            totalTokens: result.usage?.total_tokens || 0
        })

        return sendResponse(res, 200, {
            info: 'Success',
            text: result.text,
            model: result.model,
            provider: result.provider,
            logId
        })
    } catch (err) {
        const latencyMs = Date.now() - startTime

        await createLog({
            uid: getUid(req),
            packageName,
            platform,
            type: 'audio',
            model: req.body?.model || 'unknown',
            modelVariant: req.body?.modelVariant || '',
            prompt: req.body?.prompt || '',
            systemInstruction: req.body?.systemInstruction || '',
            status: 'error',
            errorMessage: err.message || 'Unknown error',
            latencyMs
        })

        return sendResponse(res, 500, { info: `AI audio generation failed: ${err.message}` }, err)
    }
}

// ─── POST /api/v1/ai/generate-bulk ──────────────────────────────────────────

/**
 * Multi-turn chat / conversation.
 * Body: { model, messages: [{ role, content }], systemInstruction?, temperature?, modelVariant? }
 */
exports.generateBulk = async (req, res) => {
    const startTime = Date.now()
    const packageName = getPackageName(req)
    const platform = getPlatform(req)
    console.log(`[AI] generateBulk: package=${packageName}, platform=${platform}`)

    try {
        const { model, messages, systemInstruction, temperature, modelVariant } = req.body

        if (!model) return sendResponse(res, 400, { info: 'model is required ("gemini" or "chatgpt")' })
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return sendResponse(res, 400, { info: 'messages array is required and must not be empty' })
        }

        // Validate each message has role and content
        for (let i = 0; i < messages.length; i++) {
            const msg = messages[i]
            if (!msg.role || !msg.content) {
                return sendResponse(res, 400, { info: `messages[${i}] must have "role" and "content"` })
            }
        }

        // Create log entry (pending)
        const logId = await createLog({
            uid: getUid(req),
            packageName,
            platform,
            type: 'bulk',
            model,
            modelVariant: modelVariant || '',
            prompt: messages[messages.length - 1]?.content || '',
            systemInstruction: systemInstruction || '',
            messages,
            status: 'pending'
        })

        // Call AI
        const result = await generateAiResponse({
            model,
            type: 'bulk',
            messages,
            systemInstruction,
            temperature,
            modelVariant
        })

        const latencyMs = Date.now() - startTime

        // Update log with response
        await updateLog(logId, {
            responseText: result.text,
            responseModel: result.model,
            status: 'success',
            latencyMs,
            promptTokens: result.usage?.prompt_tokens || 0,
            completionTokens: result.usage?.completion_tokens || 0,
            totalTokens: result.usage?.total_tokens || 0
        })

        return sendResponse(res, 200, {
            info: 'Success',
            text: result.text,
            model: result.model,
            provider: result.provider,
            logId
        })
    } catch (err) {
        const latencyMs = Date.now() - startTime

        await createLog({
            uid: getUid(req),
            packageName,
            platform,
            type: 'bulk',
            model: req.body?.model || 'unknown',
            modelVariant: req.body?.modelVariant || '',
            prompt: '',
            systemInstruction: req.body?.systemInstruction || '',
            messages: req.body?.messages || [],
            status: 'error',
            errorMessage: err.message || 'Unknown error',
            latencyMs
        })

        return sendResponse(res, 500, { info: `AI bulk generation failed: ${err.message}` }, err)
    }
}

// ─── GET /api/v1/ai/logs ────────────────────────────────────────────────────

/**
 * Query AI request/response logs.
 * Query params: uid, model, type, status, limit (default 20), offset (default 0)
 */
exports.getLogs = async (req, res) => {
    try {
        const { uid, model, type, status, limit = 20, offset = 0 } = req.query

        const query = {}
        if (uid) query.uid = uid
        if (model) query.model = model
        if (type) query.type = type
        if (status) query.status = status

        const pageLimit = Math.min(parseInt(limit) || 20, 100)
        const pageOffset = parseInt(offset) || 0

        const [logs, total] = await Promise.all([
            AiRequestLog.find(query)
                .sort({ createdAt: -1 })
                .limit(pageLimit)
                .skip(pageOffset)
                .lean(),
            AiRequestLog.countDocuments(query)
        ])

        return sendResponse(res, 200, {
            info: 'Success',
            logs,
            total,
            limit: pageLimit,
            offset: pageOffset,
            hasMore: pageOffset + pageLimit < total
        })
    } catch (err) {
        return sendResponse(res, 500, { info: 'Failed to fetch AI logs' }, err)
    }
}

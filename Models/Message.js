const mongoose = require('mongoose')

// FIX #1 — Individual messages, previously embedded as
// Conversation.messages[]. A long-running coaching conversation
// with text, image, and audio turns can grow past sane document-size
// limits and causes write amplification when embedded. Promoting
// Message to its own collection makes it paginate naturally and
// keeps Conversation small and cheap to read.
//
// Query pattern: fetch by conversationId, sorted by createdAt,
// paginated.

const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'assistant', 'system'],
        required: true
    },
    content: {
        type: String,
        default: ''
    },
    contentType: {
        type: String,
        enum: ['text', 'image', 'audio', 'video', 'document'],
        default: 'text'
    },
    assetIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAsset'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
})

// Paginated message fetch in chronological order
MessageSchema.index({ conversationId: 1, createdAt: 1 })

module.exports = mongoose.model('Message', MessageSchema, 'Messages')

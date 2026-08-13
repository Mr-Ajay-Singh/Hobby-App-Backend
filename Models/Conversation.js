const mongoose = require('mongoose')

// FIX #1 — Messages no longer embedded here. See Message model.
// A long-running coaching conversation with text, image, and audio
// turns can grow past sane document-size limits and causes write
// amplification when embedded. Promoting Message to its own collection
// makes it paginate naturally and keeps Conversation small and cheap
// to read.

const ConversationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userHobbyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserHobby',
        required: true
    },
    title: {
        type: String,
        default: ''
    },
    // FIX #1 — replaces the embedded messages array
    messageCount: {
        type: Number,
        default: 0
    },
    // FIX #1 — short snippet for list views, avoids fetching Message
    // docs just to render a conversation list
    lastMessagePreview: {
        type: String,
        default: ''
    },
    lastMessageAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
})

// Conversation list, most recently active first
ConversationSchema.index({ userHobbyId: 1, lastMessageAt: -1 })

module.exports = mongoose.model('Conversation', ConversationSchema, 'Conversations')

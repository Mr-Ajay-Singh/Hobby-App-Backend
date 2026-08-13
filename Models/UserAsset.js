const mongoose = require('mongoose')

const UserAssetSchema = new mongoose.Schema({
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
    type: {
        type: String,
        enum: ['image', 'audio', 'video', 'document', 'diagram', 'svg'],
        required: true
    },
    mimeType: {
        type: String,
        default: ''
    },
    url: {
        type: String,
        default: ''
    },
    storageKey: {
        type: String,
        default: ''
    },
    fileName: {
        type: String,
        default: ''
    },
    fileSize: {
        type: Number,
        default: 0
    },
    durationSeconds: {
        type: Number,
        default: null
    },
    // Type-specific metadata: width, height, pages, svg, voice, etc.
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    purpose: {
        type: String,
        enum: [
            'practice',
            'question',
            'assessment',
            'reference',
            'learning_diagram',
            'learning_audio',
            'submission',
            'portfolio',
            'feedback'
        ],
        default: 'practice'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
})

// Fetch assets by purpose within a hobby
UserAssetSchema.index({ userHobbyId: 1, purpose: 1 })

module.exports = mongoose.model('UserAsset', UserAssetSchema, 'UserAssets')

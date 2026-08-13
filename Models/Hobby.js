const mongoose = require('mongoose')

const HobbySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        default: ''
    },
    capabilities: {
        type: [String],
        enum: ['text', 'audio', 'vision', 'svg_generation', 'youtube', 'flashcards', 'document', 'reasoning', 'domain_engine'],
        default: ['text']
    }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('Hobby', HobbySchema, 'Hobbies')

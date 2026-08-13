const mongoose = require('mongoose')

const HobbySkillSchema = new mongoose.Schema({
    hobbyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hobby',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
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
    parentSkillId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HobbySkill',
        default: null
    },
    skillType: {
        type: String,
        enum: ['knowledge', 'physical', 'creative', 'technical', 'strategic'],
        required: true
    },
    assessmentMethods: {
        type: [String],
        enum: ['text', 'image', 'audio', 'video', 'quiz', 'performance', 'self_assessment'],
        default: ['text']
    },
    // FIX #2 — Skill versioning: once a skill has any UserSkill
    // referencing it, edits create a new version (new document,
    // version incremented, previousVersionId set, old doc isActive=false)
    // rather than mutating the existing document.
    version: {
        type: Number,
        default: 1,
        min: 1
    },
    previousVersionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HobbySkill',
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
})

// Fetch current (active) skill set for a hobby
HobbySkillSchema.index({ hobbyId: 1, isActive: 1 })

module.exports = mongoose.model('HobbySkill', HobbySkillSchema, 'HobbySkills')

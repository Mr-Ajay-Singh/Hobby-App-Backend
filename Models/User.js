const mongoose = require('mongoose')

// FIX #8 — External auth identity mapping and duplicate-account protection.
// _id (ObjectId) remains the internal primary key. External auth identity
// (Firebase/Auth0/Cognito/etc.) is stored separately in authProvider +
// authProviderId with its own unique index, rather than forcing the
// provider's UID into _id. email also gets its own unique index —
// nothing previously stopped duplicate accounts.

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    displayName: {
        type: String,
        default: '',
        trim: true
    },
    photoUrl: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: '⚡'
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
        unique: true,
        sparse: true
    },
    // firebase | auth0 | google | apple | email, etc.
    authProvider: {
        type: String,
        required: true,
        enum: ['firebase', 'auth0', 'google', 'apple', 'email', 'anonymous']
    },
    // External auth UID (e.g. Firebase uid / Auth0 sub).
    // Looked up on login and mapped to the internal _id; kept
    // separate from _id so it survives provider migrations and
    // supports linking multiple providers to one account later.
    authProviderId: {
        type: String,
        required: true
    },
    // FIX #11 — Admin role for global hobby catalog mutations
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true,
    versionKey: false
})

// FIX #8 — Prevent duplicate accounts
UserSchema.index({ email: 1 }, { unique: true, sparse: true })

// FIX #8 — Login lookup: one external identity -> one user
UserSchema.index({ authProvider: 1, authProviderId: 1 }, { unique: true })

module.exports = mongoose.model('User', UserSchema, 'Users')

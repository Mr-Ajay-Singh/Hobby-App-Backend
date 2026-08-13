// Firebase Admin SDK initialization for the Hobby Coach app.
// Uses the default Firebase app instance (no named app)
// since the hobby coach is the primary app for this server.
//
// Requires either:
//   - FIREBASE_SERVICE_ACCOUNT_PATH env var pointing to a JSON file
//   - Or FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY env vars

const admin = require('firebase-admin')

function initializeHobbyCoachFirebase () {
    // Skip if already initialized as default
    if (admin.apps.length > 0 && admin.apps.some(app => app?.name === '[DEFAULT]')) {
        return admin
    }

    try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
            // Method 1: Service account JSON file
            const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            })
        } else if (process.env.FIREBASE_PROJECT_ID) {
            // Method 2: Individual env vars
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    // Private key needs newline conversion from env var
                    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
                })
            })
        } else {
            // Method 3: Application default credentials (GCP environments)
            admin.initializeApp()
        }

        console.log('[Firebase] Hobby Coach Firebase Admin initialized')
    } catch (error) {
        console.error('[Firebase] Failed to initialize:', error.message)
        console.warn('[Firebase] Auth endpoints will not work without Firebase configuration')
    }

    return admin
}

module.exports = { initializeHobbyCoachFirebase }

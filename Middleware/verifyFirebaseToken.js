
const verifyFirebaseToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return sendResponse(res, 401, { info: 'Missing or invalid authorization header' });
        }
        
        const idToken = authHeader.substring(7);
        
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.email_verified
        };
        
        next();
    } catch (error) {
        console.error('Firebase token verification error:', error);
        return sendResponse(res, 401, { info: 'Invalid Firebase token' });
    }
};

module.exports = verifyFirebaseToken;

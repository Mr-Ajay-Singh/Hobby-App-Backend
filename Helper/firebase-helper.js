const { proteinTrackerAdmin } = require('../Config/protein-tracker-admin')
const { muscleWithAiAdmin } = require('../Config/muscle-with-ai-admin')

exports.deleteProteinTrackerUser = async (uid) => {
    try {
        proteinTrackerAdmin
            .auth()
            .deleteUser(uid)
            .then((response) => {
                console.log('Response : ', response)
                console.log(`Successfully deleted user with UID: ${uid}`)
            })
            .catch((error) => {
                console.error('Error deleting user:', error)
            })
        return true
    } catch (err) {
        console.log('Error : ', err)
        return false
    }
}

exports.deleteMuscleWithAiUser = async (uid) => {
    try {
        muscleWithAiAdmin
            .auth()
            .deleteUser(uid)
            .then((response) => {
                console.log('Response : ', response)
                console.log(`Successfully deleted user with UID: ${uid}`)
            })
            .catch((error) => {
                console.error('Error deleting user:', error)
            })
        return true
    } catch (err) {
        console.log('Error : ', err)
        return false
    }
}

exports.getUserIdByMailForProteinTracker = async (email) => {
    try {
        const userRecord = await proteinTrackerAdmin.auth().getUserByEmail(email);
        console.log(`Found user with email: ${email}, UID: ${userRecord.uid}`);
        return userRecord.uid;
    } catch (error) {
        console.error('Error fetching user by email:', error);
        return null;
    }
};

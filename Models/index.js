// Barrel export for all models
// Usage: const { User, Hobby, UserHobby, ... } = require('./Models')

const User = require('./User')
const Hobby = require('./Hobby')
const UserHobby = require('./UserHobby')
const HobbySkill = require('./HobbySkill')
const UserSkill = require('./UserSkill')
const PracticeSession = require('./PracticeSession')
const Conversation = require('./Conversation')
const Message = require('./Message')
const UserAsset = require('./UserAsset')
const AIRequest = require('./AIRequest')
const RequestLog = require('./RequestLog')
const QuizAttempt = require('./QuizAttempt')

module.exports = {
    User,
    Hobby,
    UserHobby,
    HobbySkill,
    UserSkill,
    PracticeSession,
    Conversation,
    Message,
    UserAsset,
    AIRequest,
    RequestLog,
    QuizAttempt
}

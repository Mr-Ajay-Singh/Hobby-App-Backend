const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuizAttemptSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        userHobbyId: { type: Schema.Types.ObjectId, ref: 'UserHobby', required: true, index: true },
        hobbySkillId: { type: Schema.Types.ObjectId, ref: 'HobbySkill', required: true },
        quizId: { type: String, required: true },
        questionIndex: { type: Number, required: true },
        selectedIndex: { type: Number, required: true },
        correctIndex: { type: Number, required: true },
        isCorrect: { type: Boolean, required: true },
        xpAwarded: { type: Number, default: 0 }
    },
    {
        timestamps: true
    }
);

// Compound index to prevent duplicate attempts for the same question
QuizAttemptSchema.index({ userId: 1, quizId: 1, questionIndex: 1 }, { unique: true });

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);

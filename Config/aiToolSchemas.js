// JSON schemas for all AI tools (passed to the model as function definitions).
// Section 5 — AI Tools.
// Each tool has a name, description, and parameters schema.

module.exports = {
    get_user_hobby: {
        name: 'get_user_hobby',
        description: 'Get the user\'s hobby profile including goal, experience level, practice preferences, and current learning stage.',
        parameters: {
            type: 'object',
            properties: {
                userHobbyId: { type: 'string', description: 'The user hobby ID' }
            },
            required: ['userHobbyId']
        }
    },

    get_user_skills: {
        name: 'get_user_skills',
        description: 'Get the user\'s current skill scores, strengths, weaknesses, and relevant progress for their hobby.',
        parameters: {
            type: 'object',
            properties: {
                userHobbyId: { type: 'string', description: 'The user hobby ID' }
            },
            required: ['userHobbyId']
        }
    },

    get_practice_history: {
        name: 'get_practice_history',
        description: 'Get relevant recent practice sessions and their results.',
        parameters: {
            type: 'object',
            properties: {
                userHobbyId: { type: 'string', description: 'The user hobby ID' },
                limit: { type: 'number', description: 'Number of recent sessions to fetch (default: 10)' }
            },
            required: ['userHobbyId']
        }
    },

    get_current_learning_state: {
        name: 'get_current_learning_state',
        description: 'Get the user\'s current learning stage and active learning direction.',
        parameters: {
            type: 'object',
            properties: {
                userHobbyId: { type: 'string', description: 'The user hobby ID' }
            },
            required: ['userHobbyId']
        }
    },

    create_practice_session: {
        name: 'create_practice_session',
        description: 'Create a new practice session/task for the user.',
        parameters: {
            type: 'object',
            properties: {
                userHobbyId: { type: 'string', description: 'The user hobby ID' },
                type: { type: 'string', description: 'Type of practice (e.g., exercise, drill, creative)' },
                title: { type: 'string', description: 'Title of the practice task' },
                task: { type: 'string', description: 'Detailed description of what the user should practice' },
                durationSeconds: { type: 'number', description: 'Estimated duration in seconds' }
            },
            required: ['userHobbyId', 'type', 'title', 'task']
        }
    },

    complete_practice_session: {
        name: 'complete_practice_session',
        description: 'Record completion of a practice session with score and evaluation results. Score is a top-level field (0-100).',
        parameters: {
            type: 'object',
            properties: {
                practiceSessionId: { type: 'string', description: 'The practice session ID' },
                score: { type: 'number', description: 'Score from 0-100' },
                result: {
                    type: 'object',
                    description: 'Evaluation results',
                    properties: {
                        feedback: { type: 'string' },
                        mistakes: { type: 'array', items: { type: 'string' } },
                        strengths: { type: 'array', items: { type: 'string' } },
                        nextRecommendedAction: { type: 'string' }
                    }
                },
                durationSeconds: { type: 'number', description: 'Actual duration in seconds' }
            },
            required: ['practiceSessionId', 'score']
        }
    },

    update_user_skill: {
        name: 'update_user_skill',
        description: 'Update or create a user skill record. Uses find-or-create on (userHobbyId, hobbySkillId) — never a blind insert.',
        parameters: {
            type: 'object',
            properties: {
                userHobbyId: { type: 'string', description: 'The user hobby ID' },
                hobbySkillId: { type: 'string', description: 'The hobby skill ID' },
                score: { type: 'number', description: 'Skill score (0-100)' },
                confidence: { type: 'number', description: 'Confidence level (0-1)' },
                level: { type: 'string', description: 'Skill level description' },
                strengths: { type: 'array', items: { type: 'string' } },
                weaknesses: { type: 'array', items: { type: 'string' } }
            },
            required: ['userHobbyId', 'hobbySkillId']
        }
    },

    get_conversation_context: {
        name: 'get_conversation_context',
        description: 'Load relevant conversation context (recent messages).',
        parameters: {
            type: 'object',
            properties: {
                conversationId: { type: 'string', description: 'The conversation ID' },
                limit: { type: 'number', description: 'Number of recent messages (default: 20)' }
            },
            required: ['conversationId']
        }
    },

    get_user_assets: {
        name: 'get_user_assets',
        description: 'Get relevant uploaded asset metadata for the user\'s hobby.',
        parameters: {
            type: 'object',
            properties: {
                userHobbyId: { type: 'string', description: 'The user hobby ID' },
                purpose: { type: 'string', description: 'Filter by purpose: practice, question, assessment, reference' }
            },
            required: ['userHobbyId']
        }
    },

    search_youtube: {
        name: 'search_youtube',
        description: 'Search YouTube for learning videos related to the hobby/skill. Results are safety-filtered.',
        parameters: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'Search query for YouTube' },
                hobbyName: { type: 'string', description: 'The hobby name for context-aware filtering' },
                maxResults: { type: 'number', description: 'Max results to return (default: 5, max: 10)' }
            },
            required: ['query']
        }
    },

    generate_svg: {
        name: 'generate_svg',
        description: 'Generate an animated/interactive SVG learning artifact. Checks content cache first.',
        parameters: {
            type: 'object',
            properties: {
                hobbySkillId: { type: 'string', description: 'The hobby skill ID' },
                topic: { type: 'string', description: 'What the SVG should illustrate' },
                style: { type: 'string', description: 'Style preference: diagram, animation, interactive' },
                complexity: { type: 'string', description: 'Complexity: simple, moderate, detailed' }
            },
            required: ['hobbySkillId', 'topic']
        }
    },

    generate_flashcards: {
        name: 'generate_flashcards',
        description: 'Generate flashcards for a hobby/topic/skill. Checks content cache first.',
        parameters: {
            type: 'object',
            properties: {
                hobbySkillId: { type: 'string', description: 'The hobby skill ID' },
                topic: { type: 'string', description: 'Topic for flashcards' },
                count: { type: 'number', description: 'Number of flashcards (default: 10, max: 30)' },
                difficulty: { type: 'string', description: 'Difficulty: beginner, intermediate, advanced' }
            },
            required: ['hobbySkillId', 'topic']
        }
    }
}

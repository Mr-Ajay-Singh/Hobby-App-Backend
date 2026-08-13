// Constants and Enums for Skill Learning Chatbot System
// Section: Extensibility Tokens

const RESPONSE_TYPE = {
    CLARIFICATION: 'clarification',       // Bot asks for missing user information
    LEARNING_CONTENT: 'learning_content', // Bot delivers multi-modal lesson (Text, SVG, Audio, Quiz, etc.)
    PRACTICE_DRILL: 'practice_drill',     // Bot provides step-by-step exercise
    ASSESSMENT: 'assessment',             // Bot evaluates user performance
    OFF_TOPIC_REDIRECT: 'off_topic_redirect' // Bot redirects off-topic questions
}

const LEARNING_FORM = {
    TEXT: 'text',                         // Markdown educational text & explanation
    SVG: 'svg',                           // Inline SVG vector diagram / visual chart
    AUDIO: 'audio',                       // Synthesized spoken audio (MP3 + script)
    INTERACTIVE_QUIZ: 'interactive_quiz', // Multiple-choice quiz questions
    FLASHCARD: 'flashcard',               // Q&A memory cards deck
    MUSICAL_NOTES: 'musical_notes',       // Playable instrument notes data
    CHECKLIST: 'checklist',               // Interactive step-by-step checklist
    VIDEO: 'video',                       // Video demonstration / embed link
    CODE_SNIPPET: 'code_snippet'          // Executable / highlighted code snippet
}

const SKILL_LEVEL = {
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced',
    EXPERT: 'expert'
}

const SKILL_TYPE = {
    KNOWLEDGE: 'knowledge',   // Concepts, rules, theory
    PHYSICAL: 'physical',     // Body mechanics, dexterity
    CREATIVE: 'creative',     // Composition, design, improvisation
    TECHNICAL: 'technical',   // Equipment usage, tools
    STRATEGIC: 'strategic'    // Game strategy, tactics
}

const USER_ASSET_PURPOSE = {
    PRACTICE: 'practice',
    QUESTION: 'question',
    ASSESSMENT: 'assessment',
    REFERENCE: 'reference',
    LEARNING_DIAGRAM: 'learning_diagram', // Generated SVG diagram
    LEARNING_AUDIO: 'learning_audio'      // Generated TTS MP3 audio
}

const AUDIO_VOICE = {
    ALLOY: 'alloy',
    ECHO: 'echo',
    FABLE: 'fable',
    ONYX: 'onyx',
    NOVA: 'nova',
    SHIMMER: 'shimmer'
}

module.exports = {
    RESPONSE_TYPE,
    LEARNING_FORM,
    SKILL_LEVEL,
    SKILL_TYPE,
    USER_ASSET_PURPOSE,
    AUDIO_VOICE
}

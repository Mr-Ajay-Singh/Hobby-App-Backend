// Model tier configuration: primary/fallback providers, model names, cost estimates.
// Section 7 — Model Routing.
// FIX #12 (provider fallback): defines secondary providers per tier.

module.exports = {
    tiers: {
        // Simple tasks: classification, extraction, tagging, small transformations, flashcards
        simple: {
            primary: { provider: 'gemini', model: 'gemini-2.0-flash-lite' },
            fallback: { provider: 'chatgpt', model: 'gpt-4.1-nano' },
            costPer1kInput: 0.0001,
            costPer1kOutput: 0.0004
        },

        // Normal tasks: coaching, explanations, exercise generation, curriculum updates
        normal: {
            primary: { provider: 'gemini', model: 'gemini-2.5-flash' },
            fallback: { provider: 'chatgpt', model: 'gpt-4.1-mini' },
            costPer1kInput: 0.00015,
            costPer1kOutput: 0.0006
        },

        // Complex tasks: deep reasoning, difficult skill diagnosis, complex planning
        complex: {
            primary: { provider: 'gemini', model: 'gemini-2.5-pro' },
            fallback: { provider: 'chatgpt', model: 'gpt-4.1' },
            costPer1kInput: 0.0025,
            costPer1kOutput: 0.01
        },

        // Audio-capable model
        audio: {
            primary: { provider: 'gemini', model: 'gemini-2.5-flash' },
            fallback: { provider: 'chatgpt', model: 'gpt-4o-mini-audio-preview' },
            costPer1kInput: 0.0003,
            costPer1kOutput: 0.0012
        },

        // Vision-capable model
        vision: {
            primary: { provider: 'gemini', model: 'gemini-2.5-flash' },
            fallback: { provider: 'chatgpt', model: 'gpt-4.1-mini' },
            costPer1kInput: 0.0003,
            costPer1kOutput: 0.0012
        }
    },

    // Task classification keywords → tier mapping
    taskClassification: {
        simple: [
            'classify', 'extract', 'tag', 'format', 'convert',
            'summarize', 'list', 'flashcard', 'translate', 'label'
        ],
        complex: [
            'analyze deeply', 'diagnose', 'complex plan', 'long-term curriculum',
            'unknown hobby', 'ambiguous', 'multi-step reasoning',
            'advanced technique', 'root cause'
        ]
        // Anything not matching simple or complex → normal tier
    },

    // Max tokens for different contexts
    maxTokens: {
        simple: 1024,
        normal: 4096,
        complex: 8192,
        audio: 4096,
        vision: 4096
    },

    // Default temperature per tier
    temperature: {
        simple: 0.3,
        normal: 0.7,
        complex: 0.5,
        audio: 0.5,
        vision: 0.5
    }
}

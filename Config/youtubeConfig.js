// YouTube channel allowlist/blocklist configuration.
// FIX #10 — Safety filtering for YouTube search results.

module.exports = {
    // Global blocklist — channels blocked across all hobbies
    globalBlocklist: [
        // Add channel IDs of channels to block globally
    ],

    // Per-hobby allowlists — if set, only these channels are allowed
    // Key: hobby slug, Value: array of channel IDs
    hobbyAllowlists: {
        // Example:
        // guitar: ['UC...channel1', 'UC...channel2'],
    },

    // Per-hobby blocklists — channels blocked for specific hobbies
    hobbyBlocklists: {
        // Example:
        // piano: ['UC...channelToBlock'],
    },

    // Maximum results to return
    maxResults: 10,

    // Default search parameters
    defaults: {
        type: 'video',
        videoEmbeddable: true,
        videoCategoryId: '27', // Education category
        relevanceLanguage: 'en',
        safeSearch: 'strict'
    }
}

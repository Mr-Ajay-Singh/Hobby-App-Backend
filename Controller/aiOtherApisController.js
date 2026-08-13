// const QueryTracker = require('../Models/QueryTracker');
const { OpenAI } = require('openai');

// Valid piano notes (C3-C6) - 37 keys
const VALID_PIANO_NOTES = [
    'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
    'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
    'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
    'C6'
];

// Search for songs using AI
exports.searchSongsFromInternet = async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const prompt = `
You are a music assistant. Given the search query: "${query}",
suggest 5 popular songs that match this query. These should be real, well-known songs.

Provide ONLY a JSON response with the following format:
{
  "songs": [
    {
      "title": "Song Title",
      "artist": "Artist Name",
      "difficulty": "easy" | "medium" | "hard"
    }
  ]
}

Difficulty should be based on:
- "easy": Simple melodies, nursery rhymes, basic pop songs
- "medium": Standard pop/rock songs, moderate complexity
- "hard": Complex classical pieces, jazz, intricate melodies

Do not include any explanations, only the JSON object.
`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4.1-nano-2025-04-14',
            messages: [
                { role: 'system', content: 'You are a music assistant that suggests songs in JSON format only.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
        });

        let responseData;
        try {
            responseData = JSON.parse(response.choices[0].message.content.trim());
        } catch (parseError) {
            return res.status(500).json({
                error: "Unable to search songs",
                message: "Failed to parse song suggestions"
            });
        }

        return res.json(responseData);
    } catch (error) {
        console.error('Error searching songs:', error);
        res.status(500).json({
            error: "Unable to search songs",
            message: error.message
        });
    }
};

// Get available phrases/sections for a song
exports.getSongPhrases = async (req, res) => {
    try {
        const { title, artist, noteCount, range } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const targetNotes = noteCount || 30;
        const noteRange = range || 10;

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const prompt = `
You are a music assistant. For the song: "${title}" by "${artist || 'Unknown'}",
identify the main sections/phrases of this song that can be played on instruments.

Target note count is around ${targetNotes} notes (±${noteRange} notes per phrase).

Provide ONLY a JSON response with the following format:
{
  "phrases": [
    {
      "name": "Intro",
      "noteCount": 25,
      "description": "The opening melody",
      "lyrics": ""
    },
    {
      "name": "Verse 1",
      "noteCount": 35,
      "description": "First verse melody",
      "lyrics": "First few lines of verse 1 lyrics..."
    },
    {
      "name": "Chorus",
      "noteCount": 40,
      "description": "Main chorus hook",
      "lyrics": "Main chorus lyrics..."
    }
  ]
}

Rules:
- Include 3-5 distinct phrases/sections
- Each phrase should have a realistic note count (between ${targetNotes - noteRange} and ${targetNotes + noteRange})
- Use standard musical section names (Intro, Verse, Chorus, Bridge, Outro, Hook, etc.)
- Description should be brief (5-10 words)
- Lyrics should contain the actual lyrics for that section (1-2 lines), or empty string for instrumental parts

Do not include any explanations, only the JSON object.
`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4.1-nano-2025-04-14',
            messages: [
                { role: 'system', content: 'You are a music assistant that identifies song sections in JSON format only.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.5,
        });

        let responseData;
        try {
            responseData = JSON.parse(response.choices[0].message.content.trim());
        } catch (parseError) {
            return res.status(500).json({
                error: "Unable to get phrases",
                message: "Failed to parse song phrases"
            });
        }

        return res.json(responseData);
    } catch (error) {
        console.error('Error getting song phrases:', error);
        res.status(500).json({
            error: "Unable to get phrases",
            message: error.message
        });
    }
};

// Generate piano notes for a song using AI
exports.generateSongNotes = async (req, res) => {
    try {
        const { title, artist, noteCount, instrument, validNotes, phraseName } = req.body;

        if (!title || !noteCount) {
            return res.status(400).json({ error: 'Title and noteCount are required' });
        }

        const notesToUse = validNotes || VALID_PIANO_NOTES;
        const instrumentName = instrument || 'piano';
        const phraseInfo = phraseName ? ` - specifically the "${phraseName}" section` : '';

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const prompt = `
You are an expert music transcriber. Generate PRECISE ${instrumentName} notes for the song: "${title}" by "${artist || 'Unknown'}"${phraseInfo}.

Task:
Retrieve the EXACT melody of this song's ${phraseName || 'main hook'} from your knowledge base.
Transcribe it into exactly ${noteCount} notes.
Do NOT improvise. Do NOT generate random notes. The melody must be instantly recognizable to a fan of the song.

CRITICAL: You can ONLY use these notes: ${notesToUse.join(', ')}

Provide ONLY a JSON response with the following format:
{
  "title": "${title}${phraseName ? ` - ${phraseName}` : ''}",
  "artist": "${artist || 'Unknown'}",
  "difficulty": "easy" | "medium" | "hard",
  "notes": [
    {
      "note": "C4",
      "durationMs": 400,
      "delayMs": 100
    }
  ]
}

Rules for notes:
- "note": Must be the EXACT pitch from the original melody, transposed to the provided valid notes.
- "durationMs": Use accurate rhythmic values (e.g. short for 8th notes, long for half notes) to match the song's rhythm.
- "delayMs": Use rests only where they exist in the original song.
- If the melody is longer than ${noteCount} notes, provide the first ${noteCount} notes.
- If the melody is shorter, repeat the phrase to reach ${noteCount} notes.
- Ensure the result sounds EXACTLY like "${title}".

Do not include any explanations, only the JSON object.
`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4.1-nano-2025-04-14',
            messages: [
                { role: 'system', content: 'You are an expert music transcriber that outputs precise melodies in JSON format.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.2, // Lower temperature for more deterministic/accurate results
        });

        let responseData;
        try {
            responseData = JSON.parse(response.choices[0].message.content.trim());
        } catch (parseError) {
            return res.status(500).json({
                error: "Unable to generate notes",
                message: "Failed to parse generated notes"
            });
        }

        // Validate that all notes are valid
        if (responseData.notes) {
            responseData.notes = responseData.notes.filter(note =>
                notesToUse.includes(note.note)
            );
        }

        return res.json(responseData);
    } catch (error) {
        console.error('Error generating song notes:', error);
        res.status(500).json({
            error: "Unable to generate notes",
            message: error.message
        });
    }
};

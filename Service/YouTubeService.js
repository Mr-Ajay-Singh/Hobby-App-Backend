const axios = require('axios');
const NodeCache = require('node-cache');

// 24-Hour Cache for YouTube search results (quota saver)
const youtubeCache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 });

/**
 * Searches YouTube Data API v3 for embeddable tutorial videos matching a hobby/topic query.
 * Returns formatted video metadata for in-chat playback.
 */
async function searchYouTubeVideo(query) {
  if (!query || typeof query !== 'string' || !query.trim()) {
    return null;
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey || apiKey.startsWith('your-')) {
    console.warn('[YouTubeService] YOUTUBE_API_KEY is missing or unconfigured.');
    return null;
  }

  const cleanQuery = query.trim().toLowerCase();
  const cacheKey = `yt_video_${cleanQuery}`;
  const cachedVideo = youtubeCache.get(cacheKey);

  if (cachedVideo) {
    return cachedVideo;
  }

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${query} tutorial lesson`,
        type: 'video',
        videoEmbeddable: 'true',
        maxResults: 1,
        key: apiKey,
      },
      timeout: 8000,
    });

    const items = response.data?.items;
    if (!Array.isArray(items) || items.length === 0) {
      return null;
    }

    const item = items[0];
    const videoId = item.id?.videoId;
    if (!videoId) return null;

    const videoData = {
      title: item.snippet?.title || 'Tutorial Video',
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1`,
      thumbnailUrl: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      channelTitle: item.snippet?.channelTitle || 'YouTube Tutorial',
    };

    youtubeCache.set(cacheKey, videoData);
    return videoData;
  } catch (err) {
    console.error('[YouTubeService] Error searching YouTube video:', err.message);
    return null;
  }
}

module.exports = {
  searchYouTubeVideo,
};

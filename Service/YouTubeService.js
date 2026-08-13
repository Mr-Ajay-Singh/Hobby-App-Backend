const axios = require('axios');
const NodeCache = require('node-cache');

// 24-Hour Cache for YouTube search results (quota saver)
const youtubeCache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 });

/**
 * Searches YouTube Data API v3 for embeddable tutorial videos matching a hobby/topic query.
 * Filters out previously seen video IDs to prevent duplicate video suggestions.
 */
async function searchYouTubeVideo(query, seenVideoIds = new Set()) {
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
  let items = youtubeCache.get(cacheKey);

  if (!items) {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: `${query} tutorial lesson`,
          type: 'video',
          videoEmbeddable: 'true',
          maxResults: 5,
          key: apiKey,
        },
        timeout: 8000,
      });

      items = response.data?.items || [];
      if (items.length > 0) {
        youtubeCache.set(cacheKey, items);
      }
    } catch (err) {
      console.error('[YouTubeService] Error searching YouTube video:', err.message);
      return null;
    }
  }

  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  // Filter out any video that has already been delivered in this conversation
  const selectedItem = items.find(item => {
    const vId = item.id?.videoId;
    return vId && !seenVideoIds.has(vId);
  }) || items[0];

  const videoId = selectedItem.id?.videoId;
  if (!videoId) return null;

  return {
    title: selectedItem.snippet?.title || 'Tutorial Video',
    videoId,
    embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1`,
    thumbnailUrl: selectedItem.snippet?.thumbnails?.high?.url || selectedItem.snippet?.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    channelTitle: selectedItem.snippet?.channelTitle || 'YouTube Tutorial',
  };
}

module.exports = {
  searchYouTubeVideo,
};

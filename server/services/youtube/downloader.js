/**
 * Main YouTube downloader module that uses yt-dlp for downloading videos
 */

const path = require('path');
const { VIDEOS_DIR } = require('../../config');
const { getVideoInfo } = require('./infoUtils');
const { downloadWithYtdlp } = require('./ytdlpDownloader');

/**
 * Download YouTube video using yt-dlp
 * @param {string} videoId - YouTube video ID
 * @param {boolean} useCookies - Whether to use browser cookies for authentication
 * @returns {Promise<Object>} - Result object with success status and path
 */
async function downloadYouTubeVideo(videoId, useCookies = true) {
  const videoURL = `https://www.youtube.com/watch?v=${videoId}`;
  const outputPath = path.join(VIDEOS_DIR, `${videoId}.mp4`);



  // Get video info first
  let videoInfo;
  try {
    videoInfo = await getVideoInfo(videoId);

  } catch (error) {
    console.warn(`Could not get video info from oEmbed API: ${error.message}`);
    videoInfo = { title: `YouTube Video ${videoId}` };
  }

  try {
    // Always pass '360p' as the quality parameter to ensure consistent behavior
    // Pass videoId for progress tracking
    const result = await downloadWithYtdlp(videoURL, outputPath, '360p', videoId, useCookies);

    if (result === false) {
      // Download was cancelled
      return {
        success: false,
        cancelled: true,
        message: `Download cancelled for ${videoId}`,
        title: videoInfo.title,
        method: 'yt-dlp'
      };
    }

    return {
      success: true,
      path: outputPath,
      message: `Video downloaded successfully with yt-dlp`,
      title: videoInfo.title,
      method: 'yt-dlp'
    };
  } catch (error) {
    console.error(`yt-dlp download failed:`, error.message);
    throw new Error(`YouTube download failed: ${error.message}`);
  }
}

module.exports = {
  downloadYouTubeVideo
};

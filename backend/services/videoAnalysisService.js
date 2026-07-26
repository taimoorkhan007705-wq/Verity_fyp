import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import path from 'path'
import fs from 'fs'
import { extractTextFromImage, isNewsClaim } from './ocrService.js'
import { factCheckWithMistral, interpretFactCheck } from './factCheckService.js'

// point fluent-ffmpeg to our installed binary
ffmpeg.setFfmpegPath(ffmpegPath.path)

/**
 * Extract frames from a video every N seconds into a temp directory
 * @param {string} videoPath - path to the video file
 * @param {string} outputDir - directory to save frames
 * @param {number} interval  - seconds between frames (default 3)
 * @returns {Promise<string[]>} list of frame file paths
 */
export const extractFrames = (videoPath, outputDir, interval = 3) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

    ffmpeg(videoPath)
      .outputOptions([`-vf fps=1/${interval}`, '-q:v 2'])
      .output(path.join(outputDir, 'frame-%04d.jpg'))
      .on('end', () => {
        const frames = fs.readdirSync(outputDir)
          .filter(f => f.startsWith('frame-') && f.endsWith('.jpg'))
          .map(f => path.join(outputDir, f))
                resolve(frames)
      })
      .on('error', (err) => {
                reject(err)
      })
      .run()
  })
}

/**
 * Extract audio from a video as a WAV file
 * @param {string} videoPath
 * @param {string} outputAudioPath
 * @returns {Promise<string>} path to audio file
 */
export const extractAudio = (videoPath, outputAudioPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .noVideo()
      .audioCodec('pcm_s16le')
      .audioFrequency(16000)
      .audioChannels(1)
      .output(outputAudioPath)
      .on('end', () => {
                resolve(outputAudioPath)
      })
      .on('error', (err) => {
        // video might have no audio track — not an error
                resolve(null)
      })
      .run()
  })
}

/**
 * Get video duration in seconds
 */
export const getVideoDuration = (videoPath) => {
  return new Promise((resolve) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return resolve(0)
      resolve(metadata?.format?.duration || 0)
    })
  })
}

/**
 * Transcribe audio using Ollama's Mistral (text description approach)
 * Note: For full speech-to-text, Whisper would be needed.
 * Here we use OCR on frames as the primary text extraction method.
 */

/**
 * Run full fake-news analysis on a video:
 * 1. Extract frames
 * 2. OCR each frame for text
 * 3. Fact-check any news claims found
 * 4. Clean up temp files
 *
 * @param {string} videoPath
 * @returns {Promise<{ verdict: string, reason: string, extractedText: string }>}
 */
export const analyzeVideoForFakeNews = async (videoPath) => {
  const tempDir = path.join(path.dirname(videoPath), `_frames_${Date.now()}`)

  try {
    // check duration — skip very long videos (> 5 min) to save processing time
    const duration = await getVideoDuration(videoPath)
        // extract frames (1 frame every 3 seconds, max 20 frames)
    const interval = Math.max(3, Math.floor(duration / 20))
    const frames = await extractFrames(videoPath, tempDir, interval)

    if (frames.length === 0) {
      return { verdict: 'approved', reason: 'No frames extracted from video', extractedText: '' }
    }

    // run OCR on each frame and collect all text
    const allTexts = []
    for (const framePath of frames) {
      const text = await extractTextFromImage(framePath)
      if (isNewsClaim(text)) {
        allTexts.push(text)
      }
    }

    // deduplicate very similar texts (same headline across frames)
    const uniqueTexts = [...new Set(allTexts.map(t => t.toLowerCase().trim()))]
      .slice(0, 5) // limit to 5 unique claims
    const combinedText = uniqueTexts.join(' | ')

        if (uniqueTexts.length === 0) {
      return { verdict: 'approved', reason: 'No text claims found in video frames', extractedText: '' }
    }

    // fact-check the combined text
    const factCheckResult = await factCheckWithMistral(combinedText)
    const modResult = interpretFactCheck(factCheckResult, combinedText)

    return {
      ...modResult,
      extractedText: combinedText
    }

  } catch (err) {
        return { verdict: 'approved', reason: 'Video analysis failed — manual review recommended', extractedText: '' }
  } finally {
    // clean up temp frames
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true })
              }
    } catch (cleanupErr) {
          }
  }
}


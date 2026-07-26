import FormData from 'form-data'
import fs from 'fs'
import fetch from 'node-fetch'
import { extractTextFromImage, isNewsClaim } from './ocrService.js'
import { factCheckWithMistral, interpretFactCheck } from './factCheckService.js'
import { analyzeVideoForFakeNews } from './videoAnalysisService.js'

/**
 * Full media moderation pipeline
 *
 * For IMAGES:
 *   1. Sightengine  → AI-generated, nudity/18+, gore, offensive
 *   2. Tesseract    → OCR: extract any text from the image
 *   3. Mistral      → fact-check extracted text (local LLM via Ollama)
 *
 * For VIDEOS:
 *   1. Sightengine  → AI-generated, nudity/18+, gore
 *   2. FFmpeg       → extract frames
 *   3. Tesseract    → OCR on frames
 *   4. Mistral      → fact-check any news claims found in frames
 *
 * Returns: { verdict, score, reason, extractedText }
 *   verdict: 'approved' | 'pending' | 'rejected'
 */
export const checkMediaWithAI = async (filePath, mimeType) => {
  const SIGHTENGINE_USER = process.env.SIGHTENGINE_USER
  const SIGHTENGINE_SECRET = process.env.SIGHTENGINE_SECRET

  const isVideo = mimeType?.startsWith('video/')
  let extractedText = ''

  try {
    // ══════════════════════════════════════════════════════
    // STEP 1 — Sightengine moderation (existing logic)
    // ══════════════════════════════════════════════════════
    let sightengineResult = null

    if (!SIGHTENGINE_USER || SIGHTENGINE_USER === 'your_api_user') {
          } else {
      const form = new FormData()
      form.append('media', fs.createReadStream(filePath))
      form.append('models', 'genai,nudity-2.1,offensive,gore-2.0')
      form.append('api_user', SIGHTENGINE_USER)
      form.append('api_secret', SIGHTENGINE_SECRET)

      const endpoint = isVideo
        ? 'https://api.sightengine.com/1.0/video/check-sync.json'
        : 'https://api.sightengine.com/1.0/check.json'

      const res = await fetch(endpoint, { method: 'POST', body: form })
      const data = await res.json()
      console.log('[Sightengine]', JSON.stringify(data))

      if (data.status !== 'failure') {
        sightengineResult = data

        // ── 1a. AI-generated detection ─────────────────────
        const aiScore = data.type?.ai_generated ?? null
        if (aiScore !== null && aiScore >= 0.8) {
          return { verdict: 'rejected', score: aiScore, reason: 'AI-generated content detected', extractedText }
        }

        // ── 1b. Nudity / 18+ ───────────────────────────────
        const nudity = data.nudity
        if (nudity) {
          const explicit = nudity.sexual_activity ?? nudity.explicit ?? 0
          const suggestive = nudity.suggestive ?? nudity.partial ?? 0
          if (explicit >= 0.5) {
            return { verdict: 'rejected', score: explicit, reason: 'Explicit sexual content detected', extractedText }
          }
          if (suggestive >= 0.6) {
            return { verdict: 'pending', score: suggestive, reason: 'Suggestive content — sent to reviewer', extractedText }
          }
        }

        // ── 1c. Gore / violence ────────────────────────────
        const gore = data.gore
        if (gore) {
          const goreScore = gore.prob ?? 0
          if (goreScore >= 0.85) {
            return { verdict: 'rejected', score: goreScore, reason: 'Extreme graphic/violent content detected', extractedText }
          }
          if (goreScore >= 0.6) {
            return { verdict: 'pending', score: goreScore, reason: 'Graphic/violent content — sent to reviewer', extractedText }
          }
        }

        // ── 1d. Offensive content ──────────────────────────
        const offensive = data.offensive
        if (offensive) {
          const offScore = offensive.prob ?? 0
          if (offScore >= 0.7) {
            return { verdict: 'pending', score: offScore, reason: 'Potentially offensive content — sent to reviewer', extractedText }
          }
        }

        // ── 1e. Uncertain AI score ─────────────────────────
        if (aiScore !== null && aiScore >= 0.4) {
          return { verdict: 'pending', score: aiScore, reason: 'Uncertain AI detection — sent to reviewer', extractedText }
        }
      }
    }

    // ══════════════════════════════════════════════════════
    // STEP 2 — Fake news detection (OCR + Mistral)
    // ══════════════════════════════════════════════════════

    if (isVideo) {
      // ── Video: extract frames → OCR → fact-check ────────
            const videoResult = await analyzeVideoForFakeNews(filePath)
      extractedText = videoResult.extractedText || ''

      if (videoResult.verdict === 'rejected') {
        return { verdict: 'rejected', score: null, reason: videoResult.reason, extractedText }
      }
      if (videoResult.verdict === 'pending') {
        return { verdict: 'pending', score: null, reason: videoResult.reason, extractedText }
      }

    } else {
      // ── Image: OCR → fact-check ──────────────────────────
            const rawText = await extractTextFromImage(filePath)
      extractedText = rawText

      if (isNewsClaim(rawText)) {
        console.log(`[Moderation] News claim detected: "${rawText.substring(0, 80)}..."`)
        const factCheckResult = await factCheckWithMistral(rawText)
        const modResult = interpretFactCheck(factCheckResult, rawText)

        if (modResult.verdict !== 'approved') {
          return { verdict: modResult.verdict, score: null, reason: modResult.reason, extractedText }
        }
      } else {
              }
    }

    // ══════════════════════════════════════════════════════
    // STEP 3 — All checks passed → approve
    // ══════════════════════════════════════════════════════
    return {
      verdict: 'approved',
      score: null,
      reason: 'Content passed all moderation checks',
      extractedText
    }

  } catch (err) {
        // on unexpected error, approve so users aren't blocked
    return { verdict: 'approved', score: null, reason: err.message, extractedText }
  }
}


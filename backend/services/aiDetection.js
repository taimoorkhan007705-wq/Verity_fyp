import FormData from 'form-data'
import fs from 'fs'
import fetch from 'node-fetch'

export const checkMediaWithAI = async (filePath, mimeType) => {
  const SIGHTENGINE_USER = process.env.SIGHTENGINE_USER
  const SIGHTENGINE_SECRET = process.env.SIGHTENGINE_SECRET

  try {
    if (!SIGHTENGINE_USER || SIGHTENGINE_USER === 'your_api_user') {
      return { verdict: 'approved', score: null, reason: 'AI detection not configured' }
    }

    const isVideo = mimeType?.startsWith('video/')
    const form = new FormData()
    form.append('media', fs.createReadStream(filePath))
    // check both AI generation AND offensive content
    form.append('models', 'genai,nudity-2.1,offensive,gore-2.0')
    form.append('api_user', SIGHTENGINE_USER)
    form.append('api_secret', SIGHTENGINE_SECRET)

    const endpoint = isVideo
      ? 'https://api.sightengine.com/1.0/video/check-sync.json'
      : 'https://api.sightengine.com/1.0/check.json'

    const res = await fetch(endpoint, { method: 'POST', body: form })
    const data = await res.json()

    console.log('Sightengine response:', JSON.stringify(data))

    if (data.status === 'failure') {
      // on API error, approve so users aren't blocked
      return { verdict: 'approved', score: null, reason: data.error?.message || 'API error' }
    }

    // ── 1. Check AI-generated ──────────────────────────────
    const aiScore = data.type?.ai_generated ?? null
    if (aiScore !== null && aiScore >= 0.8) {
      return { verdict: 'rejected', score: aiScore, reason: 'AI-generated content detected' }
    }

    // ── 2. Check nudity / 18+ ──────────────────────────────
    const nudity = data.nudity
    if (nudity) {
      const explicit = nudity.sexual_activity ?? nudity.explicit ?? 0
      const suggestive = nudity.suggestive ?? nudity.partial ?? 0
      if (explicit >= 0.5) {
        return { verdict: 'rejected', score: explicit, reason: 'Explicit sexual content detected' }
      }
      if (suggestive >= 0.6) {
        return { verdict: 'pending', score: suggestive, reason: 'Suggestive content — sent to reviewer' }
      }
    }

    // ── 3. Check gore / violence ───────────────────────────
    const gore = data.gore
    if (gore) {
      const goreScore = gore.prob ?? 0
      if (goreScore >= 0.6) {
        return { verdict: 'pending', score: goreScore, reason: 'Graphic/violent content — sent to reviewer' }
      }
      if (goreScore >= 0.85) {
        return { verdict: 'rejected', score: goreScore, reason: 'Extreme graphic/violent content detected' }
      }
    }

    // ── 4. Check offensive content ─────────────────────────
    const offensive = data.offensive
    if (offensive) {
      const offScore = offensive.prob ?? 0
      if (offScore >= 0.7) {
        return { verdict: 'pending', score: offScore, reason: 'Potentially offensive content — sent to reviewer' }
      }
    }

    // ── 4. Uncertain AI score → reviewer ──────────────────
    if (aiScore !== null && aiScore >= 0.4) {
      return { verdict: 'pending', score: aiScore, reason: 'Uncertain AI detection — sent to reviewer' }
    }

    // ── 5. All clear → approve ─────────────────────────────
    return { verdict: 'approved', score: aiScore, reason: 'Content appears authentic and clean' }

  } catch (err) {
    console.error('AI detection error:', err.message)
    // on error, approve so users aren't blocked
    return { verdict: 'approved', score: null, reason: err.message }
  }
}

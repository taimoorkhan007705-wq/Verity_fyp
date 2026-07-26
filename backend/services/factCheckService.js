import fetch from 'node-fetch'

const OLLAMA_URL = 'http://localhost:11434/api/generate'
const MODEL = 'mistral'

/**
 * Ask Mistral (running locally via Ollama) to fact-check a text claim.
 * Returns: { verdict: 'true'|'false'|'uncertain', confidence: 0-1, reasoning: string }
 */
export const factCheckWithMistral = async (text) => {
  try {
    const prompt = `You are a fact-checking assistant. Analyze the following text extracted from an image or video and determine if it contains false or misleading information.

Text to analyze:
"${text}"

Respond in this exact JSON format (no extra text, just JSON):
{
  "containsClaim": true or false,
  "verdict": "true" or "false" or "uncertain",
  "confidence": a number between 0 and 1,
  "reasoning": "brief explanation in one sentence"
}

Rules:
- If the text has no factual claim (just a logo, watermark, or random words), set containsClaim to false
- verdict "true" = claim appears to be accurate
- verdict "false" = claim appears to be false or misleading  
- verdict "uncertain" = you cannot confidently verify it
- Be conservative: only say "false" if you are highly confident it's wrong`

    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: false,
        options: {
          temperature: 0.1, // low temp for factual consistency
          num_predict: 200
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama responded with status ${response.status}`)
    }

    const data = await response.json()
    const rawText = data.response?.trim() || ''

    // extract JSON from the response (model sometimes adds extra text)
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
            return { containsClaim: false, verdict: 'uncertain', confidence: 0, reasoning: 'Could not parse AI response' }
    }

    const parsed = JSON.parse(jsonMatch[0])
    console.log(`[FactCheck] verdict=${parsed.verdict} confidence=${parsed.confidence} claim="${text.substring(0, 60)}..."`)
    return parsed

  } catch (err) {
        // if Ollama is down or errors, default to uncertain → goes to reviewer
    return { containsClaim: false, verdict: 'uncertain', confidence: 0, reasoning: err.message }
  }
}

/**
 * Interpret fact-check result into a moderation verdict
 * Returns: { verdict: 'approved'|'pending'|'rejected', reason: string }
 */
export const interpretFactCheck = (factCheckResult, extractedText) => {
  const { containsClaim, verdict, confidence, reasoning } = factCheckResult

  // no meaningful claim found → pass through
  if (!containsClaim) {
    return { verdict: 'approved', reason: 'No factual claims detected in text' }
  }

  // high confidence false claim → auto-reject
  if (verdict === 'false' && confidence >= 0.85) {
    return {
      verdict: 'rejected',
      reason: `False information detected: ${reasoning}`
    }
  }

  // moderately confident false claim → reviewer
  if (verdict === 'false' && confidence >= 0.5) {
    return {
      verdict: 'pending',
      reason: `Potentially false claim detected (confidence: ${Math.round(confidence * 100)}%) — sent to reviewer. AI reasoning: ${reasoning}`
    }
  }

  // uncertain → reviewer
  if (verdict === 'uncertain') {
    return {
      verdict: 'pending',
      reason: `Unverifiable claim detected — sent to reviewer for manual fact-check. AI reasoning: ${reasoning}`
    }
  }

  // verified true → approve
  return { verdict: 'approved', reason: `Claim appears accurate: ${reasoning}` }
}


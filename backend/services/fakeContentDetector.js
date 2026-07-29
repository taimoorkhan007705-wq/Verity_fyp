import fetch from 'node-fetch'
import { extractTextFromImage } from './ocrService.js'
import { factCheckImageClaims, simpleFallbackFactCheck } from './factCheckingService.js'

const OLLAMA_BASE = process.env.OLLAMA_URL || 'http://localhost:11434'
const OLLAMA_URL = `${OLLAMA_BASE}/api/generate`
const MODEL = process.env.OLLAMA_MODEL || 'llama3.2'

const detectMemeContent = (caption = '', mediaFiles = []) => {
  if (mediaFiles.length === 0) {
    return null
  }

  console.log('[MemeDetector] Analyzing post with', mediaFiles.length, 'media file(s)')
  
  const hasImages = mediaFiles.some(m => m._mimeType?.startsWith('image/'))
  const hasVideos = mediaFiles.some(m => m._mimeType?.startsWith('video/'))
  
  if (!hasImages && !hasVideos) {
    return null
  }

  console.log('[MemeDetector] Found media content - running aggressive meme checks')

  if (caption && caption.trim().length > 0) {
    console.log('[MemeDetector] Image post with caption text detected - flagging as potential meme')
    return {
      verdict: 'suspicious',
      score: 0.65,
      reason: 'Image with overlay or caption text detected - high risk of misinformation',
      isAIGenerated: false
    }
  }

  if (!caption || caption.trim().length === 0) {
    console.log('[MemeDetector] Image-only post detected - likely contains embedded text meme')
    return {
      verdict: 'suspicious',
      score: 0.6,
      reason: 'Image post with embedded text detected - content requires human verification',
      isAIGenerated: false
    }
  }

  return null
}

export const detectFakeContent = async (textContent = '', mediaFiles = []) => {
  let fullText = textContent
  
  try {
    console.log('[FakeContentDetector] Starting detection with textLength:', textContent.length, 'mediaCount:', mediaFiles.length)

    console.log('[FakeContentDetector] Running aggressive meme detector...')
    const memeResult = detectMemeContent(textContent, mediaFiles)
    if (memeResult) {
      console.log('[FakeContentDetector] ⚠️  MEME DETECTED - running fact-check on image claims...')
      
      try {
        const factCheckResult = await factCheckImageClaims(mediaFiles)
        console.log('[FactCheckingService] Fact-check result:', factCheckResult)
        
        if (factCheckResult.verdict === 'false') {
          return {
            verdict: 'suspicious',
            score: 0.95,
            reason: 'Unverifiable claim',
            isAIGenerated: false,
            factCheckDetails: factCheckResult
          }
        }
        
        if (factCheckResult.verdict === 'true') {
          console.log('[FakeContentDetector] ✅ Meme content verified as TRUE')
          return {
            verdict: 'safe',
            score: 0,
            reason: 'Meme content verified by fact-checkers',
            isAIGenerated: false,
            factCheckDetails: factCheckResult
          }
        }
        
        if (factCheckResult.verdict === 'uncertain') {
          return {
            verdict: 'suspicious',
            score: 0.6,
            reason: 'Unverifiable claim',
            isAIGenerated: false,
            factCheckDetails: factCheckResult
          }
        }
      } catch (factCheckErr) {
        console.log('[FakeContentDetector] Fact-check failed, using aggressive meme rejection')
        return memeResult
      }
    }

    fullText = textContent

    console.log('[FakeContentDetector] Using fullText for detection:', {
      empty: !fullText || !fullText.trim(),
      length: fullText ? fullText.length : 0,
      preview: fullText ? fullText.substring(0, 150) : 'empty'
    })

    if (mediaFiles.length === 0 && fullText && fullText.trim().length > 10) {
      console.log('[FakeContentDetector] Text-only post - checking for false claims...')
      
      const claims = parseClaimsFromText(fullText)
      if (claims.length > 0) {
        try {
          console.log('[FakeContentDetector] Found', claims.length, 'text claims to verify')
          
          let hasUncertainClaims = false
          
          for (const claim of claims) {
            const result = await checkClaimWithGoogle(claim)
            console.log('[FakeContentDetector] Text claim result:', {
              claim: claim.substring(0, 60),
              verdict: result.verdict,
              confidence: result.confidence
            })
            
            if (result.verdict === 'false' && result.confidence > 0.7) {
              return {
                verdict: 'suspicious',
                score: 0.95,
                reason: 'Unverifiable claim',
                isAIGenerated: false
              }
            }
            
            if (result.verdict === 'uncertain') {
              hasUncertainClaims = true
            }
          }
          
          if (hasUncertainClaims) {
            return {
              verdict: 'suspicious',
              score: 0.65,
              reason: 'Unverifiable claim',
              isAIGenerated: false
            }
          }
        } catch (factCheckErr) {
          console.log('[FakeContentDetector] Text fact-check failed:', factCheckErr.message)
        }
      }
    }

    console.log('[FakeContentDetector] Running keyword-based detection...')
    const isSuspiciousByKeywords = quickFakeCheck(fullText)
    console.log('[FakeContentDetector] Keyword detection result:', isSuspiciousByKeywords)

    if (isSuspiciousByKeywords) {
      return { 
        verdict: 'suspicious', 
        score: 0.75, 
        reason: 'Unverifiable claim', 
        isAIGenerated: false 
      }
    }

    return {
      verdict: 'safe',
      score: 0,
      reason: 'No suspicious content detected',
      isAIGenerated: false,
      isFake: false,
      isMisleading: false
    }

  } catch (err) {
    console.error('[FakeContentDetector] Error during detection:', err.message)
    
    console.log('[FakeContentDetector] Error occurred - sending to reviewers')
    return { 
      verdict: 'suspicious', 
      score: 0.3,
      reason: 'Content sent to reviewers for manual verification', 
      isAIGenerated: false 
    }
  }
}

const parseClaimsFromText = (text) => {
  try {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
    
    const claims = sentences
      .map(s => s.trim())
      .filter(s => s.length > 10)
      .filter(s => {
        const lowerS = s.toLowerCase()
        return /\b(is|was|are|were|admits|claims|says|announced|revealed|confirmed|showed|proved|dead|alive|killed|died)\b/i.test(lowerS)
      })
      .slice(0, 5)

    return claims
  } catch (err) {
    return [text]
  }
}

const checkClaimWithGoogle = async (claim) => {
  try {
    const GOOGLE_FACT_CHECK_API = 'https://factchecktools.googleapis.com/v1alpha1/claims:search'
    const GOOGLE_API_KEY = process.env.GOOGLE_FACT_CHECK_API_KEY || 'AIzaSyDW_r0h8TLG8_q8y8JhVkr1s6x_p5r8x8c'

    const response = await fetch(
      `${GOOGLE_FACT_CHECK_API}?query=${encodeURIComponent(claim)}&key=${GOOGLE_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        timeout: 10000
      }
    )

    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.claims || data.claims.length === 0) {
      return {
        claim,
        verdict: 'uncertain',
        confidence: 0.3,
        sources: []
      }
    }

    const claim_obj = data.claims[0]
    const claimReview = claim_obj.claimReview?.[0]
    
    if (!claimReview) {
      return {
        claim,
        verdict: 'uncertain',
        confidence: 0.4,
        sources: [claim_obj.claimant]
      }
    }

    const rating = claimReview.textualRating?.toLowerCase() || ''

    let verdict = 'uncertain'
    let confidence = 0.5

    if (rating.includes('false') || rating.includes('no') || rating.includes('fake') || rating.includes('unfounded')) {
      verdict = 'false'
      confidence = 0.95
    } else if (rating.includes('true') || rating.includes('correct') || rating.includes('fact') || rating.includes('accurate')) {
      verdict = 'true'
      confidence = 0.95
    } else if (rating.includes('partially') || rating.includes('mixed') || rating.includes('mostly')) {
      verdict = 'uncertain'
      confidence = 0.6
    }

    return {
      claim,
      verdict,
      confidence,
      sources: [
        {
          organization: claimReview.publisher?.name || 'Unknown',
          url: claimReview.url,
          rating: claimReview.textualRating
        }
      ]
    }

  } catch (err) {
    return {
      claim,
      verdict: 'uncertain',
      confidence: 0.2,
      sources: []
    }
  }
}

export const quickFakeCheck = (content = '') => {
  const text = content.toLowerCase()
  
  const redFlags = [
    /\bbreaking\b.*\bshocking\b/,
    /\bthey don'?t want you to know\b/,
    /\b100% proven\b/,
    /\bdoctors hate\b/,
    /\bclick here to\b/,
    /\bshare if you agree\b/,
    /\bgovernment is hiding\b/,
    /\bsecret cure\b/,
    /\bmainstream media won'?t tell you\b/,
    /\badmits?\b.*(he|she|it|they|we).*(is a|are a|was a|were a)\b/i,
    /\bconfess(es)?\b.*(he|she|it|they|we).*(is a|are a|was a|were a)\b/i,
    /\bconfirm(s)?\b.*(he|she|it|they|we).*(is a|are a|was a|were a)\b/i,
    /\b(reveal|exposed|proof|evidence)\b.*(hide|cover-?up|secret|truth)\b/i,
    /\b(nobody|they|government|media)\b.*(told|want).*(you|us)\b/,
    /\b(real|actual|true|actual)\b.*(reason|purpose|agenda)\b/i,
    /\b(muslim|christian|atheist|communist|socialist|fascist)\b.*\b(muslim|christian|atheist|communist|socialist|fascist)\b/i,
    /\bfake.*(muslim|religion|accent|birth|records?)\b/i,
    /\bnot a.*born\b/i,
    /\b(admits?|reveals?|exposed?|caught|confess|proof|evidence|real truth)\b/i,
  ]
  
  const matches = redFlags.filter(pattern => pattern.test(text)).length
  
  return matches >= 2
}


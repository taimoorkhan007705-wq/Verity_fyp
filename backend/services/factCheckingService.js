import fetch from 'node-fetch'
import { extractTextFromImage } from './ocrService.js'

const GOOGLE_FACT_CHECK_API = 'https://factchecktools.googleapis.com/v1alpha1/claims:search'
const GOOGLE_API_KEY = process.env.GOOGLE_FACT_CHECK_API_KEY || 'AIzaSyDW_r0h8TLG8_q8y8JhVkr1s6x_p5r8x8c'

/**
 * FACT CHECKING SERVICE
 * Extracts text from images and verifies claims against internet sources
 * 
 * @param {Array} mediaFiles - Media files with _localPath and _mimeType
 * @returns {Promise<{verdict: 'true'|'false'|'uncertain', confidence: number, claims: Array, reason: string}>}
 */
export const factCheckImageClaims = async (mediaFiles = []) => {
  try {
    console.log('[FactCheckingService] Starting fact-check on', mediaFiles.length, 'media file(s)')
    
    if (mediaFiles.length === 0) {
      return { verdict: 'uncertain', confidence: 0, claims: [], reason: 'No media to fact-check' }
    }

    let allExtractedText = []
    let claimsToCheck = []

    // STEP 1: Extract text from all images
    console.log('[FactCheckingService] STEP 1: Extracting text from images...')
    for (const media of mediaFiles) {
      if (media._mimeType?.startsWith('image/')) {
        try {
          console.log('[FactCheckingService] Extracting from:', media._localPath)
          const imageText = await extractTextFromImage(media._localPath)
          
          if (imageText && imageText.trim().length > 5) {
            console.log('[FactCheckingService] ✅ Text extracted:', imageText.substring(0, 100))
            allExtractedText.push(imageText)
            
            // Parse claims from extracted text
            const claims = parseClaimsFromText(imageText)
            claimsToCheck.push(...claims)
          } else {
            console.log('[FactCheckingService] ⚠️  No meaningful text extracted')
          }
        } catch (err) {
          console.log('[FactCheckingService] OCR Error:', err.message)
        }
      }
    }

    if (claimsToCheck.length === 0) {
      console.log('[FactCheckingService] No claims found in images')
      return { 
        verdict: 'uncertain', 
        confidence: 0, 
        claims: [], 
        reason: 'Could not extract verifiable claims from image text' 
      }
    }

    console.log('[FactCheckingService] Found', claimsToCheck.length, 'claims to verify')

    // STEP 2: Fact-check each claim
    console.log('[FactCheckingService] STEP 2: Fact-checking claims...')
    const checkResults = []
    
    for (const claim of claimsToCheck) {
      try {
        const result = await checkClaimWithGoogle(claim)
        checkResults.push(result)
        console.log('[FactCheckingService] Claim result:', {
          claim: claim.substring(0, 60),
          verdict: result.verdict,
          confidence: result.confidence
        })
      } catch (err) {
        console.log('[FactCheckingService] Could not verify claim:', err.message)
        checkResults.push({
          claim,
          verdict: 'uncertain',
          confidence: 0.3,
          sources: []
        })
      }
    }

    // STEP 3: Determine overall verdict
    console.log('[FactCheckingService] STEP 3: Aggregating results...')
    const verdict = aggregateVerdict(checkResults)
    
    console.log('[FactCheckingService] Final verdict:', verdict)
    
    return {
      verdict: verdict.verdict,
      confidence: verdict.confidence,
      claims: checkResults,
      reason: verdict.reason,
      extractedText: allExtractedText.join('\n---\n')
    }

  } catch (err) {
    console.error('[FactCheckingService] Fatal error:', err.message)
    return {
      verdict: 'uncertain',
      confidence: 0,
      claims: [],
      reason: `Fact-checking error: ${err.message}`
    }
  }
}

/**
 * Parse claims from extracted text
 * Splits text into sentences and identifies fact-checkable claims
 */
const parseClaimsFromText = (text) => {
  try {
    // Split by sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
    
    // Filter for claim-like sentences (longer than 10 chars, contains key claim words)
    const claims = sentences
      .map(s => s.trim())
      .filter(s => s.length > 10)
      .filter(s => {
        const lowerS = s.toLowerCase()
        return /\b(is|was|are|were|admits|claims|says|announced|revealed|confirmed|showed|proved)\b/i.test(lowerS)
      })
      .slice(0, 5) // Limit to 5 claims to avoid API overload

    console.log('[FactCheckingService] Parsed claims:', claims)
    return claims
  } catch (err) {
    console.log('[FactCheckingService] Error parsing claims:', err.message)
    return [text] // Return whole text as one claim
  }
}

/**
 * Check a single claim using Google Fact Check API
 */
const checkClaimWithGoogle = async (claim) => {
  try {
    console.log('[FactCheckingService] Checking claim:', claim.substring(0, 80))

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
      console.log('[FactCheckingService] Google API error:', response.status)
      throw new Error(`Google API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.claims || data.claims.length === 0) {
      console.log('[FactCheckingService] No fact-checks found for claim')
      return {
        claim,
        verdict: 'uncertain',
        confidence: 0.3,
        sources: [],
        reason: 'No fact-checks available for this claim'
      }
    }

    // Analyze the claim ratings
    const claim_obj = data.claims[0]
    const claimReview = claim_obj.claimReview?.[0]
    
    if (!claimReview) {
      return {
        claim,
        verdict: 'uncertain',
        confidence: 0.4,
        sources: [claim_obj.claimant],
        reason: 'Claim exists but no review rating available'
      }
    }

    const rating = claimReview.textualRating?.toLowerCase() || ''
    
    console.log('[FactCheckingService] Rating from API:', rating)

    // Map rating to verdict
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
      ],
      reason: claimReview.review || `Fact-checked rating: ${rating}`
    }

  } catch (err) {
    console.error('[FactCheckingService] Google API error:', err.message)
    return {
      claim,
      verdict: 'uncertain',
      confidence: 0.2,
      sources: [],
      reason: `Could not verify: ${err.message}`
    }
  }
}

/**
 * Aggregate multiple claim verdicts into one overall verdict
 */
const aggregateVerdict = (results) => {
  if (results.length === 0) {
    return { verdict: 'uncertain', confidence: 0, reason: 'No claims to verify' }
  }

  const falseCount = results.filter(r => r.verdict === 'false').length
  const trueCount = results.filter(r => r.verdict === 'true').length
  const uncertainCount = results.filter(r => r.verdict === 'uncertain').length

  console.log('[FactCheckingService] Verdict breakdown:', { falseCount, trueCount, uncertainCount })

  // If ANY claim is confirmed false, reject
  if (falseCount > 0) {
    const avgConfidence = results
      .filter(r => r.verdict === 'false')
      .reduce((sum, r) => sum + r.confidence, 0) / falseCount
    
    return {
      verdict: 'false',
      confidence: Math.min(avgConfidence, 0.99),
      reason: `${falseCount} claim(s) verified as FALSE by fact-checkers`
    }
  }

  // If ALL claims are confirmed true, approve
  if (trueCount === results.length && trueCount > 0) {
    const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length
    return {
      verdict: 'true',
      confidence: Math.min(avgConfidence, 0.99),
      reason: `All ${trueCount} claim(s) verified as TRUE by fact-checkers`
    }
  }

  // If mixed or uncertain, mark uncertain
  return {
    verdict: 'uncertain',
    confidence: 0.5,
    reason: `Mixed results: ${trueCount} true, ${falseCount} false, ${uncertainCount} uncertain`
  }
}

/**
 * Fallback simple fact-check for when API fails
 * Uses pattern matching and keyword detection
 */
export const simpleFallbackFactCheck = (extractedText) => {
  try {
    if (!extractedText || extractedText.length < 10) {
      return { verdict: 'uncertain', confidence: 0, reason: 'Text too short to verify' }
    }

    const text = extractedText.toLowerCase()

    // Red flag phrases commonly used in misinformation
    const falseIndicators = [
      /doctors? (hate|don't want|refuse to)/,
      /governments? (hiding|covering up|suppressed)/,
      /(fake|false|hoax|conspiracy)/,
      /(not born|muslim|atheist|communist)/,
      /100% (proven|confirmed|true)/,
      /(they don't want you to know|mainstream media won't tell)/,
      /(secret|hidden|leaked) (cure|vaccine|truth)/,
    ]

    const matchedFalseFlags = falseIndicators.filter(p => p.test(text)).length

    if (matchedFalseFlags >= 2) {
      return {
        verdict: 'false',
        confidence: 0.7,
        reason: 'Content contains common misinformation red flags'
      }
    }

    return {
      verdict: 'uncertain',
      confidence: 0.3,
      reason: 'Unable to verify - requires manual review'
    }

  } catch (err) {
    console.error('[FactCheckingService] Fallback error:', err.message)
    return {
      verdict: 'uncertain',
      confidence: 0,
      reason: 'Fact-checking unavailable'
    }
  }
}

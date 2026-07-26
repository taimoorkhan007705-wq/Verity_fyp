import { createWorker } from 'tesseract.js'

/**
 * Extract text from an image file using Tesseract OCR (runs fully locally)
 * @param {string} imagePath - absolute path to the image file
 * @returns {Promise<string>} extracted text or empty string
 */
export const extractTextFromImage = async (imagePath) => {
  let worker = null
  try {
    worker = await createWorker('eng', 1, {
      logger: () => {} // silence progress logs
    })
    const { data } = await worker.recognize(imagePath)
    const text = data.text?.trim() || ''
        return text
  } catch (err) {
        return ''
  } finally {
    if (worker) await worker.terminate()
  }
}

/**
 * Check if extracted text is a meaningful news claim or potentially fake news
 * (filter out short captions, watermarks, etc.)
 */
export const isNewsClaim = (text) => {
  if (!text || text.length < 10) return false
  
  const lowerText = text.toLowerCase()
  
  // Keywords that suggest potential fake news or important claims
  const newsKeywords = [
    'dead', 'died', 'killed', 'death', 'murdered', 'assassination',
    'president', 'minister', 'elected', 'resign', 'arrested',
    'breaking', 'confirmed', 'announced', 'declared', 'banned',
    'war', 'attack', 'bomb', 'terrorist', 'crash', 'disaster',
    'scandal', 'exposed', 'leaked', 'investigation',
    'covid', 'vaccine', 'pandemic', 'outbreak',
    'election', 'voting', 'government', 'congress', 'senate'
  ]
  
  // Check if text contains any news-related keywords
  const hasNewsKeyword = newsKeywords.some(keyword => lowerText.includes(keyword))
  if (hasNewsKeyword) {
    console.log(`[OCR] News-related keyword detected in text: "${text.substring(0, 60)}"`)
    return true
  }
  
  // For longer text (15+ chars) with at least 3 words, fact-check it
  const wordCount = text.trim().split(/\s+/).length
  if (text.length >= 15 && wordCount >= 3) {
    return true
  }
  
  return false
}


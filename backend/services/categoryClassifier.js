import fetch from 'node-fetch'
import { extractTextFromImage } from './ocrService.js'

const OLLAMA_URL = 'http://localhost:11434/api/generate'
const MODEL = 'mistral'

/**
 * Automatically classify post content into one of the predefined categories
 * using Mistral AI (running locally via Ollama).
 * 
 * Categories: Sports, News, Trending, Entertainment, Food, Other
 * 
 * @param {string} textContent - The text content of the post
 * @param {Array} mediaFiles - Array of media file objects with _localPath and _mimeType
 * @returns {Promise<{category: string, confidence: number, reasoning: string}>}
 */
export const classifyPostCategory = async (textContent = '', mediaFiles = []) => {
  try {
    let extractedImageText = ''
    
    // Extract text from images (if any) to get more context
    if (mediaFiles.length > 0) {
      for (const media of mediaFiles) {
        if (media._mimeType?.startsWith('image/')) {
          try {
            const imageText = await extractTextFromImage(media._localPath)
            if (imageText) {
              extractedImageText += (extractedImageText ? ' | ' : '') + imageText
            }
          } catch (err) {
                      }
        }
      }
    }

    // Combine text content and extracted image text
    const fullText = [textContent, extractedImageText].filter(Boolean).join('\n\n')
    
    if (!fullText.trim()) {
            return { category: 'Other', confidence: 1.0, reasoning: 'No text content available' }
    }

    const prompt = `You are a content classifier. Analyze the following post content and classify it into exactly ONE of these categories:

Categories:
- Sports: Sports events, teams, athletes, games, competitions, fitness, exercise
- News: Breaking news, current events, politics, world events, announcements, journalism
- Entertainment: Movies, TV shows, music, celebrities, arts, culture, gaming, concerts
- Food: Food photos, recipes, cooking, meals, restaurants, groceries, culinary content
- Other: Personal content (selfies, daily activities, casual photos, personal updates, general posts)

IMPORTANT RULES FOR "OTHER":
- Selfies, personal photos, casual selfies → Other
- Daily routines, daily life, "what I did today" → Other
- Food photos, meals, cooking → Other
- Generic statements without specific topic → Other
- Personal milestones, celebrations → Other
- Travel photos, vacation pics → Other
- Fashion/outfit posts → Other

Post content to classify:
"${fullText}"

Respond in this exact JSON format (no extra text, just JSON):
{
  "category": "Sports" or "News" or "Entertainment" or "Other",
  "confidence": a number between 0 and 1,
  "reasoning": "brief explanation in one sentence"
}

Rules:
- Choose the SINGLE most appropriate category
- Use "Other" if the content is personal or doesn't clearly fit Sports, News, or Entertainment
- Personal posts, selfies, daily activities MUST be "Other"
- Be decisive: avoid "uncertain" - pick the best match
- Confidence below 0.6 means it should be classified as "Other"
- Focus on the main topic/theme of the content`

    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: false,
        options: {
          temperature: 0.2, // low temp for consistent classification
          num_predict: 150
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama responded with status ${response.status}`)
    }

    const data = await response.json()
    const rawText = data.response?.trim() || ''

    // Extract JSON from the response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
            return { category: 'Other', confidence: 0, reasoning: 'Could not parse AI response' }
    }

    const parsed = JSON.parse(jsonMatch[0])
    
    // Validate category is one of the allowed values (Note: Trending is NOT in AI classification)
    const validCategories = ['Sports', 'News', 'Entertainment', 'Food', 'Other']
    if (!validCategories.includes(parsed.category)) {
            parsed.category = 'Other'
    }

    // If confidence is low, default to Other
    if (parsed.confidence < 0.6) {
      console.log(`[CategoryClassifier] Low confidence (${parsed.confidence}), defaulting to Other`)
      return { 
        category: 'Other', 
        confidence: parsed.confidence, 
        reasoning: `Low confidence classification: ${parsed.reasoning}` 
      }
    }

        return parsed

  } catch (err) {
        // On error, default to "Other" so post creation doesn't fail
    return { 
      category: 'Other', 
      confidence: 0, 
      reasoning: `Classification failed: ${err.message}` 
    }
  }
}

/**
 * Quick synchronous category assignment for posts without waiting for AI
 * This is used as a fallback or for immediate post creation
 * 
 * @param {string} content - Post text content
 * @returns {string} - Category name
 */
export const quickCategoryGuess = (content = '') => {
  const text = content.toLowerCase()
  
  // Personal/daily life keywords - classify as Other
  if (/\b(selfie|myself|me|my day|daily|today|morning|evening|life|routine|feeling|mood)\b/.test(text)) {
    return 'Other'
  }
  
  // Food posts - classify as Food when the content clearly indicates food or cooking
  if (/\b(food|eating|lunch|dinner|breakfast|meal|delicious|yummy|tasty|cooking|recipe|restaurant|cooking|chef|baking)\b/.test(text)) {
    return 'Food'
  }
  
  // Sports keywords
  if (/\b(football|soccer|basketball|tennis|cricket|sports|game|match|player|team|win|won|goal|score|championship|cup)\b/.test(text)) {
    return 'Sports'
  }
  
  // News keywords
  if (/\b(breaking|news|announced|report|update|election|politics|government|president|minister)\b/.test(text)) {
    return 'News'
  }
  
  // Entertainment keywords
  if (/\b(movie|film|music|song|actor|actress|celebrity|concert|album|show|series|netflix|spotify)\b/.test(text)) {
    return 'Entertainment'
  }
  
  // Default to Other (personal content)
  return 'Other'
}


import { ollamaChat, ollamaGenerate, ollamaHealth } from '../../services/ollamaService.js'

// System prompt that gives the AI context about Verity
const SYSTEM_PROMPT = `You are Verity Assistant, an AI helper for the Verity social media platform. 
You help users with questions about products, posts, fact-checking, and general assistance.
Be concise, helpful, and friendly. Keep responses under 200 words unless more detail is needed.`

export const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body
    if (!message?.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' })
    }

    // Build conversation: system + history + new message
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-10), // keep last 10 messages for context
      { role: 'user', content: message.trim() }
    ]

    const reply = await ollamaChat(messages)
    res.json({ success: true, reply, model: 'llama3.2' })
  } catch (error) {
    console.error('AI chat error:', error.message)
    res.status(500).json({ success: false, message: 'AI service unavailable', error: error.message })
  }
}

export const generate = async (req, res) => {
  try {
    const { prompt } = req.body
    if (!prompt?.trim()) {
      return res.status(400).json({ success: false, message: 'Prompt is required' })
    }
    const response = await ollamaGenerate(prompt.trim())
    res.json({ success: true, response, model: 'llama3.2' })
  } catch (error) {
    console.error('AI generate error:', error.message)
    res.status(500).json({ success: false, message: 'AI service unavailable', error: error.message })
  }
}

export const health = async (req, res) => {
  try {
    const status = await ollamaHealth()
    res.json({ success: true, ...status })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

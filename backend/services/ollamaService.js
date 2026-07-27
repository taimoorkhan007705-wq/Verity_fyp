// Ollama AI service — wraps local llama3.2 model
import fetch from 'node-fetch'

const OLLAMA_BASE = process.env.OLLAMA_URL || 'http://localhost:11434'
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'llama3.2'

/**
 * Send a chat completion request to Ollama
 * @param {Array} messages - [{role: 'user'|'assistant'|'system', content: string}]
 * @param {string} model - model name (default: llama3.2)
 * @returns {Promise<string>} - assistant reply text
 */
export const ollamaChat = async (messages, model = DEFAULT_MODEL) => {
  const response = await fetch(`${OLLAMA_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, stream: false })
  })
  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Ollama error ${response.status}: ${err}`)
  }
  const data = await response.json()
  return data.message?.content || ''
}

/**
 * Simple single-prompt generation
 * @param {string} prompt
 * @param {string} model
 * @returns {Promise<string>}
 */
export const ollamaGenerate = async (prompt, model = DEFAULT_MODEL) => {
  const response = await fetch(`${OLLAMA_BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt, stream: false })
  })
  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Ollama error ${response.status}: ${err}`)
  }
  const data = await response.json()
  return data.response || ''
}

/**
 * Check if Ollama is reachable and the model is available
 */
export const ollamaHealth = async () => {
  try {
    const response = await fetch(`${OLLAMA_BASE}/api/tags`, { method: 'GET' })
    if (!response.ok) return { ok: false, error: 'Ollama not reachable' }
    const data = await response.json()
    const models = data.models?.map(m => m.name) || []
    const hasModel = models.some(m => m.startsWith(DEFAULT_MODEL))
    return { ok: true, models, hasModel, activeModel: DEFAULT_MODEL }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}

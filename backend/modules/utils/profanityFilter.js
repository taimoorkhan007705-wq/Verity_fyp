// List of common bad words/profanities
const badWords = [
  'badword1', 'badword2', 'badword3', 'badword4', 'badword5',
  'curse1', 'curse2', 'curse3', 'curse4', 'curse5',
  'insult1', 'insult2', 'insult3', 'insult4', 'insult5',
  'offensive1', 'offensive2', 'offensive3', 'offensive4', 'offensive5',
  'hate', 'racist', 'sexist', 'discrimination',
  'damn', 'hell', 'crap', 'piss', 'suck', 'ass', 'bitch', 'bastard', 'stupid', 'idiot'
]

// Create regex pattern for word boundaries
const createBadWordRegex = () => {
  const escapedWords = badWords.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  return new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi')
}

export const filterProfanity = (text) => {
  if (!text || typeof text !== 'string') return text
  
  const regex = createBadWordRegex()
  // Replace bad words with asterisks
  return text.replace(regex, (match) => {
    return '*'.repeat(match.length)
  })
}

export const containsProfanity = (text) => {
  if (!text || typeof text !== 'string') return false
  
  const regex = createBadWordRegex()
  return regex.test(text)
}

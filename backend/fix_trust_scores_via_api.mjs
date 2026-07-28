/**
 * Fix Trust Scores via API Call
 * This script calls the recalculate endpoint which will set all reviewers to 0
 * and then recalculate based on their actual approved posts
 */

const API_URL = 'http://localhost:5000/api'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'test_token'

console.log('🔧 Starting Trust Score Fix via API...')
console.log(`Using API URL: ${API_URL}`)

// First, let's get an admin token by logging in as admin
console.log('\n📝 Step 1: Getting admin authentication token...')

try {
  const loginResponse = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'iamadmin@verity.com',
      password: 'iamAdmin098'
    })
  })

  if (!loginResponse.ok) {
    throw new Error(`Login failed: ${loginResponse.statusText}`)
  }

  const loginData = await loginResponse.json()
  const token = loginData.token

  if (!token) {
    throw new Error('No token in login response')
  }

  console.log('✅ Got admin token')

  // Now call the recalculation endpoint
  console.log('\n🔄 Step 2: Calling trust score recalculation endpoint...')
  
  const recalcResponse = await fetch(`${API_URL}/reviewer/admin/recalculate-trust-scores`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  if (!recalcResponse.ok) {
    throw new Error(`Recalculation failed: ${recalcResponse.statusText}`)
  }

  const recalcData = await recalcResponse.json()
  
  console.log('✅ Recalculation complete!')
  console.log(`   Total reviewers: ${recalcData.totalReviewers}`)
  console.log(`   Updated: ${recalcData.updated}`)
  console.log(`   Message: ${recalcData.message}`)

  // Get the updated leaderboard
  console.log('\n📊 Step 3: Fetching updated leaderboard...')
  
  const leaderboardResponse = await fetch(`${API_URL}/reviewer/leaderboard`)
  const leaderboardData = await leaderboardResponse.json()

  console.log('✅ Updated Leaderboard (Top 5):')
  leaderboardData.leaderboard.slice(0, 5).forEach((reviewer) => {
    console.log(`   #${reviewer.rank}. ${reviewer.name}: ${reviewer.trustScore}% (${reviewer.reviewsCompleted} reviews)`)
  })

  console.log('\n✅ Trust Score Fix Complete!')
  process.exit(0)

} catch (error) {
  console.error('❌ Error:', error.message)
  process.exit(1)
}

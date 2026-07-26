import mongoose from 'mongoose'
import Reviewer from './models/Reviewer.js'
import dotenv from 'dotenv'

dotenv.config()

async function checkReviewers() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    
    const reviewers = await Reviewer.find({})
      .select('email user_info.fullName trust_security.trustScore reviewer_stats')
      .sort({ 'trust_security.trustScore': -1 })
    
    console.log('\n=== REVIEWERS IN DATABASE ===')
    console.log('Total reviewers:', reviewers.length)
    
    if (reviewers.length === 0) {
      console.log('No reviewers found in database')
    } else {
      console.log('\nList of reviewers:')
      reviewers.forEach((r, idx) => {
        const name = r.user_info?.fullName || 'Unknown'
        const email = r.email
        const trust = r.trust_security?.trustScore || 50
        const completed = r.reviewer_stats?.reviewsCompleted || 0
        console.log(`${idx + 1}. ${name} (${email}) - Trust: ${trust}, Reviews: ${completed}`)
      })
    }
    
    await mongoose.connection.close()
    process.exit(0)
  } catch (e) {
    console.error('Error:', e.message)
    process.exit(1)
  }
}

checkReviewers()

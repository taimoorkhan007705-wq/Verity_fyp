import mongoose from 'mongoose'
import Reviewer from './models/Reviewer.js'
import dotenv from 'dotenv'

dotenv.config()

const mongoUrl = process.env.MONGODB_URI

console.log('🔧 Starting Trust Score Fix...')
console.log('Connecting to MongoDB...')

try {
  // Set up mongoose to handle network errors better
  await mongoose.connect(mongoUrl, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000
  })
  
  console.log('✅ Connected to MongoDB')

  console.log('\n📊 Finding reviewers with trust score = 50...')
  const reviewers = await Reviewer.find({ 'trust_security.trustScore': 50 })
  
  console.log(`Found ${reviewers.length} reviewers with trust score 50`)
  
  if (reviewers.length > 0) {
    console.log('\n🔄 Updating to trust score 0...')
    
    const result = await Reviewer.updateMany(
      { 'trust_security.trustScore': 50 },
      { 
        $set: { 
          'trust_security.trustScore': 0,
          'trust_security.trustScoreCalculatedAt': new Date()
        }
      }
    )
    
    console.log(`✅ Updated ${result.modifiedCount} reviewers`)
    
    // Show updated list
    const updatedReviewers = await Reviewer.find({}).select('user_info.fullName trust_security.trustScore').limit(10)
    console.log('\n📋 First 10 reviewers (updated):')
    updatedReviewers.forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.user_info.fullName}: ${r.trust_security.trustScore}%`)
    })
  } else {
    console.log('✅ All reviewers already have correct trust score')
  }
  
  console.log('\n✅ Trust Score Fix Complete!')
  await mongoose.connection.close()
  process.exit(0)
  
} catch (error) {
  console.error('❌ Error:', error.message)
  await mongoose.connection.close()
  process.exit(1)
}

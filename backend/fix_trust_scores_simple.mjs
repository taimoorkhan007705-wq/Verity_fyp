#!/usr/bin/env node

import mongoose from 'mongoose'

// MongoDB connection string
const MONGO_URI = 'mongodb+srv://taimoorkhan:th7071705@cluster0.cdtghag.mongodb.net/?appName=Cluster0'

console.log('🔧 Connecting to MongoDB Atlas...')
console.log('URI:', MONGO_URI.replace(/:[^:]*@/, ':****@'))

// Connect with longer timeout
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 60000,
  connectTimeoutMS: 30000,
  retryWrites: true,
  w: 'majority'
}).then(async () => {
  console.log('✅ Connected to MongoDB')
  
  try {
    const db = mongoose.connection.db
    
    // Find all reviewers with trust score 50
    console.log('\n📊 Searching for reviewers with trust score 50...')
    const result = await db.collection('reviewers').updateMany(
      { 'trust_security.trustScore': 50 },
      { 
        $set: { 
          'trust_security.trustScore': 0,
          'trust_security.trustScoreCalculatedAt': new Date()
        }
      }
    )
    
    console.log(`✅ Updated ${result.modifiedCount} reviewers`)
    console.log(`   Matched: ${result.matchedCount}`)
    console.log(`   Modified: ${result.modifiedCount}`)
    
    if (result.modifiedCount > 0) {
      // Show sample of updated reviewers
      console.log('\n📋 Sample of updated reviewers:')
      const samples = await db.collection('reviewers')
        .find({ 'trust_security.trustScore': 0 })
        .limit(5)
        .toArray()
      
      samples.forEach((r, i) => {
        console.log(`   ${i + 1}. ${r.user_info?.fullName}: ${r.trust_security?.trustScore}%`)
      })
    }
    
    console.log('\n✅ Trust Score Fix Complete!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Database operation failed:', err.message)
    process.exit(1)
  }
}).catch(err => {
  console.error('❌ Connection failed:', err.message)
  process.exit(1)
})

/**
 * Create test users and reviewers for testing
 * Run with: node create_test_users.js
 */

import mongoose from 'mongoose'
import Reviewer from './backend/models/Reviewer.js'
import User from './backend/models/User.js'
import dotenv from 'dotenv'

dotenv.config()

async function createTestUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Create 3 Reviewers
    console.log('\n📝 Creating Reviewers...')
    
    const reviewers = [
      {
        email: 'alice@reviewer.com',
        password: 'Reviewer123',
        user_info: { fullName: 'Alice Reviewer' }
      },
      {
        email: 'bob@reviewer.com',
        password: 'Reviewer123',
        user_info: { fullName: 'Bob Reviewer' }
      },
      {
        email: 'charlie@reviewer.com',
        password: 'Reviewer123',
        user_info: { fullName: 'Charlie Reviewer' }
      }
    ]

    let createdReviewers = []
    for (const reviewerData of reviewers) {
      // Check if already exists
      const existing = await Reviewer.findOne({ email: reviewerData.email })
      if (existing) {
        console.log(`⚠️  Reviewer ${reviewerData.email} already exists`)
        createdReviewers.push(existing)
      } else {
        const reviewer = await Reviewer.create({
          email: reviewerData.email,
          password: reviewerData.password,
          user_info: {
            fullName: reviewerData.user_info.fullName,
            firstName: reviewerData.user_info.fullName.split(' ')[0],
            lastName: reviewerData.user_info.fullName.split(' ').slice(1).join(' ')
          },
          trust_security: {
            isActive: true,
            isVerified: true,
            trustScore: 85
          },
          reviewer_stats: {
            reviewsCompleted: 0,
            reviewsPending: 0,
            accuracy: 95,
            approvedCount: 0,
            rejectedCount: 0
          }
        })
        console.log(`✅ Created reviewer: ${reviewer.user_info.fullName} (${reviewer._id})`)
        createdReviewers.push(reviewer)
      }
    }

    // Create 1 Test User
    console.log('\n👤 Creating Test User...')
    
    const userData = {
      email: 'testuser@user.com',
      password: 'User123',
      user_info: { fullName: 'Test User' }
    }

    let testUser = await User.findOne({ email: userData.email })
    if (!testUser) {
      testUser = await User.create({
        email: userData.email,
        password: userData.password,
        user_info: {
          fullName: userData.user_info.fullName,
          firstName: userData.user_info.fullName.split(' ')[0],
          lastName: userData.user_info.fullName.split(' ').slice(1).join(' ')
        }
      })
      console.log(`✅ Created user: ${testUser.user_info.fullName} (${testUser._id})`)
    } else {
      console.log(`⚠️  User ${userData.email} already exists`)
    }

    // Print summary
    console.log('\n' + '='.repeat(60))
    console.log('📊 ACCOUNTS CREATED')
    console.log('='.repeat(60))
    
    console.log('\n🔑 REVIEWERS:')
    createdReviewers.forEach((r, i) => {
      console.log(`  ${i+1}. ${r.user_info.fullName}`)
      console.log(`     Email: ${r.email}`)
      console.log(`     Password: Reviewer123`)
      console.log(`     ID: ${r._id}`)
    })

    console.log('\n👤 USER:')
    console.log(`  1. ${testUser.user_info.fullName}`)
    console.log(`     Email: ${testUser.email}`)
    console.log(`     Password: User123`)
    console.log(`     ID: ${testUser._id}`)

    console.log('\n📱 LOGIN URLS:')
    console.log(`  Frontend: http://localhost:3000`)
    console.log(`  Tunnel: http://10.103.107.76:3000`)

    console.log('\n' + '='.repeat(60))

    await mongoose.connection.close()
    console.log('✅ Done!')
    process.exit(0)

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

createTestUsers()

/**
 * Create test reviewers with stats for leaderboard
 * Run with: cd backend && node create_test_reviewers.mjs
 */

import mongoose from 'mongoose'
import Reviewer from './models/Reviewer.js'
import dotenv from 'dotenv'

dotenv.config()

async function createTestReviewers() {
  try {
    console.log('🔗 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Create 5 Test Reviewers with different stats
    const reviewers = [
      {
        email: 'alice@reviewer.com',
        password: 'Reviewer123',
        fullName: 'Alice Johnson',
        trustScore: 95,
        reviewsCompleted: 127,
        accuracy: 96.5,
        approvedCount: 110,
        rejectedCount: 17,
        expertise: 'Expert'
      },
      {
        email: 'bob@reviewer.com',
        password: 'Reviewer123',
        fullName: 'Bob Smith',
        trustScore: 88,
        reviewsCompleted: 89,
        accuracy: 91.2,
        approvedCount: 72,
        rejectedCount: 17,
        expertise: 'Senior'
      },
      {
        email: 'charlie@reviewer.com',
        password: 'Reviewer123',
        fullName: 'Charlie Brown',
        trustScore: 82,
        reviewsCompleted: 54,
        accuracy: 88.9,
        approvedCount: 42,
        rejectedCount: 12,
        expertise: 'Senior'
      },
      {
        email: 'diana@reviewer.com',
        password: 'Reviewer123',
        fullName: 'Diana Prince',
        trustScore: 76,
        reviewsCompleted: 31,
        accuracy: 85.5,
        approvedCount: 24,
        rejectedCount: 7,
        expertise: 'Junior'
      },
      {
        email: 'evan@reviewer.com',
        password: 'Reviewer123',
        fullName: 'Evan Davis',
        trustScore: 68,
        reviewsCompleted: 15,
        accuracy: 80.0,
        approvedCount: 10,
        rejectedCount: 5,
        expertise: 'Junior'
      }
    ]

    let createdCount = 0

    for (const reviewerData of reviewers) {
      // Check if already exists
      let reviewer = await Reviewer.findOne({ email: reviewerData.email })

      if (reviewer) {
        console.log(`⚠️  Reviewer already exists: ${reviewerData.email}`)
      } else {
        reviewer = await Reviewer.create({
          email: reviewerData.email,
          password: reviewerData.password,
          role: 'Reviewer',
          user_info: {
            fullName: reviewerData.fullName,
            firstName: reviewerData.fullName.split(' ')[0],
            lastName: reviewerData.fullName.split(' ').slice(1).join(' '),
            location: 'Platform'
          },
          profile_info: {
            avatar: null,
            bio: `${reviewerData.expertise} Content Reviewer`
          },
          trust_security: {
            isActive: true,
            isVerified: true,
            trustScore: reviewerData.trustScore
          },
          reviewer_stats: {
            reviewsCompleted: reviewerData.reviewsCompleted,
            reviewsPending: 0,
            accuracy: reviewerData.accuracy,
            approvedCount: reviewerData.approvedCount,
            rejectedCount: reviewerData.rejectedCount,
            flaggedCount: 0
          },
          reviewer_profile: {
            specialization: ['General', 'News', 'Sports'],
            expertiseLevel: reviewerData.expertise
          }
        })

        console.log(`✅ Created reviewer: ${reviewerData.fullName} (Trust Score: ${reviewerData.trustScore})`)
        createdCount++
      }
    }

    console.log(`\n📊 Summary:`)
    console.log(`✅ ${createdCount} new reviewers created`)
    console.log(`Total reviewers in database: ${await Reviewer.countDocuments()}`)

    await mongoose.connection.close()
    console.log('✅ Done!')
    process.exit(0)

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

createTestReviewers()

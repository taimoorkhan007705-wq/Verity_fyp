/**
 * Create test users and reviewers for testing
 * Run with: cd backend && node create_test_users.js
 */

import mongoose from 'mongoose'
import Reviewer from './models/Reviewer.js'
import User from './models/User.js'
import dotenv from 'dotenv'

dotenv.config()

async function createTestUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
        // Create 3 Reviewers
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
        `)
        createdReviewers.push(reviewer)
      }
    }

    // Create 1 Test User
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
      `)
    } else {
          }

    // Print summary
    )
        )
    
        createdReviewers.forEach((r, i) => {
                            })

                                        )

    await mongoose.connection.close()
        process.exit(0)

  } catch (error) {
        process.exit(1)
  }
}

createTestUsers()


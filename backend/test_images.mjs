import mongoose from 'mongoose'
import Post from './models/Post.js'
import dotenv from 'dotenv'

dotenv.config()

const testImageFetch = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log('✅ Connected to MongoDB')

    // Find posts with media
    const postsWithMedia = await Post.find({ media: { $exists: true, $ne: [] } })
      .select('content media author createdAt')
      .limit(5)

    console.log(`\n📊 Found ${postsWithMedia.length} posts with media\n`)

    postsWithMedia.forEach((post, idx) => {
      console.log(`Post ${idx + 1}:`)
      console.log(`  ID: ${post._id}`)
      console.log(`  Content: ${post.content?.substring(0, 50)}...`)
      console.log(`  Media count: ${post.media?.length || 0}`)
      if (post.media && post.media.length > 0) {
        post.media.forEach((m, midx) => {
          console.log(`    Media ${midx + 1}:`)
          console.log(`      Type: ${m.type}`)
          console.log(`      URL: ${m.url}`)
        })
      }
      console.log()
    })

    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

testImageFetch()

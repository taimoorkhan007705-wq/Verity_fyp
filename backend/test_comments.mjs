import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import Post from './models/Post.js'
import User from './models/User.js'
import Reviewer from './models/Reviewer.js'

const uri = process.env.MONGODB_URI
const url = new URL(uri)
const username = encodeURIComponent(url.username)
const password = encodeURIComponent(url.password)
const auth = username ? `${username}:${password}@` : ''
const hosts = ['ac-plohefn-shard-00-00.cdtghag.mongodb.net:27017','ac-plohefn-shard-00-02.cdtghag.mongodb.net:27017','ac-plohefn-shard-00-01.cdtghag.mongodb.net:27017']
const fallback = `mongodb://${auth}${hosts.join(',')}${url.pathname}${url.search || '?appName=Cluster0&tls=true'}`

async function testComments() {
  try {
    await mongoose.connect(fallback, { serverSelectionTimeoutMS:10000, connectTimeoutMS:10000, socketTimeoutMS:10000, family:4 })
    console.log('✅ Connected to MongoDB')

    // Find latest post
    const post = await Post.findOne().sort({ createdAt: -1 })
    
    if (!post) {
      console.log('❌ No posts found')
      process.exit(0)
    }

    console.log('\n📝 Latest Post:')
    console.log('  Post ID:', post._id)
    console.log('  Comments Count:', post.commentsCount)
    console.log('  Comments Array Length:', post.comments.length)
    
    if (post.comments.length > 0) {
      console.log('\n💬 Comments:')
      for (let i = 0; i < post.comments.length; i++) {
        const c = post.comments[i]
        console.log(`  Comment ${i + 1}:`)
        console.log(`    User ID: ${c.user}`)
        console.log(`    User Model: ${c.userModel}`)
        console.log(`    Text: "${c.text}"`)
        console.log(`    Created: ${c.createdAt}`)
      }
    } else {
      console.log('\n❌ No comments on this post')
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

testComments()

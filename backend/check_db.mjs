import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose"
import User from './models/User.js'
import Post from './models/Post.js'
import Reviewer from './models/Reviewer.js'
async function main() {
  try {
    const uri = process.env.MONGODB_URI
    console.log('URI:', uri ? uri.replace(/^(mongodb\+srv:\/\/)([^:@]+)(:[^@]+)?@/, '$1<user>$3@') : 'no uri')
    await mongoose.connect(uri, {serverSelectionTimeoutMS:10000, connectTimeoutMS:10000, socketTimeoutMS:10000, family:4})
    console.log('connected')
    const userCount = await User.countDocuments()
    const postCount = await Post.countDocuments()
    const reviewerCount = await Reviewer.countDocuments()
    console.log({ userCount, postCount, reviewerCount })
    const firstUser = await User.findOne().lean().exec()
    console.log('first user', firstUser?._id?.toString(), firstUser?.email)
  } catch (e) {
    console.error(e)
  } finally {
    await mongoose.disconnect()
  }
}
main()

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DB_PATH = path.join(__dirname, 'localDB.json')

class MockDB {
  constructor() {
    this.data = this.load()
  }

  load() {
    try {
      const data = fs.readFileSync(DB_PATH, 'utf8')
      return JSON.parse(data)
    } catch (err) {
      return {
        users: [],
        posts: [],
        reviews: [],
        stories: [],
        products: [],
        businesses: [],
        connections: [],
        messages: [],
        notifications: []
      }
    }
  }

  save() {
    fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2))
  }

  // User methods
  createUser(userData) {
    const user = {
      _id: Date.now().toString(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.data.users.push(user)
    this.save()
    return user
  }

  findUserByEmail(email) {
    return this.data.users.find(u => u.email === email)
  }

  findUserByUsername(username) {
    return this.data.users.find(u => u.username === username)
  }

  findUserById(id) {
    return this.data.users.find(u => u._id === id)
  }

  updateUser(id, updates) {
    const index = this.data.users.findIndex(u => u._id === id)
    if (index !== -1) {
      this.data.users[index] = {
        ...this.data.users[index],
        ...updates,
        updatedAt: new Date()
      }
      this.save()
      return this.data.users[index]
    }
    return null
  }

  // Post methods
  createPost(postData) {
    const post = {
      _id: Date.now().toString(),
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.data.posts.push(post)
    this.save()
    return post
  }

  getPosts(filter = {}) {
    let posts = [...this.data.posts]
    if (filter.userId) {
      posts = posts.filter(p => p.userId === filter.userId)
    }
    if (filter.status) {
      posts = posts.filter(p => p.status === filter.status)
    }
    return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  updatePost(id, updates) {
    const index = this.data.posts.findIndex(p => p._id === id)
    if (index !== -1) {
      this.data.posts[index] = {
        ...this.data.posts[index],
        ...updates,
        updatedAt: new Date()
      }
      this.save()
      return this.data.posts[index]
    }
    return null
  }
}

export default new MockDB()


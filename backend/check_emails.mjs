import { MongoClient } from 'mongodb'

const uri = 'mongodb+srv://taimoorkhan:th7071705@cluster0.cdtghag.mongodb.net/?appName=Cluster0'
const client = new MongoClient(uri)

async function checkEmails() {
  try {
    await client.connect()
    const db = client.db('cluster0')
    
    console.log('\n=== ALL USERS ===')
    const users = await db.collection('users').find({}, {projection: {email: 1, 'user_info.fullName': 1}}).toArray()
    if (users.length === 0) {
      console.log('  No users found')
    } else {
      users.forEach(u => console.log(`  ${u.email} - ${u.user_info?.fullName || 'N/A'}`))
    }
    
    console.log('\n=== ALL REVIEWERS ===')
    const reviewers = await db.collection('reviewers').find({}, {projection: {email: 1, 'user_info.fullName': 1}}).toArray()
    if (reviewers.length === 0) {
      console.log('  No reviewers found')
    } else {
      reviewers.forEach(r => console.log(`  ${r.email} - ${r.user_info?.fullName || 'N/A'}`))
    }
    
    console.log('\n=== ALL BUSINESSES ===')
    const businesses = await db.collection('businesses').find({}, {projection: {email: 1, 'business_details.businessName': 1}}).toArray()
    if (businesses.length === 0) {
      console.log('  No businesses found')
    } else {
      businesses.forEach(b => console.log(`  ${b.email} - ${b.business_details?.businessName || 'N/A'}`))
    }
    
    console.log('\n✅ Done')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await client.close()
  }
}

checkEmails()

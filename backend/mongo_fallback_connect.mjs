import mongoose from 'mongoose'
const uri = 'mongodb://ac-plohefn-shard-00-01.cdtghag.mongodb.net:27017,ac-plohefn-shard-00-00.cdtghag.mongodb.net:27017,ac-plohefn-shard-00-02.cdtghag.mongodb.net:27017/verity_fyp?retryWrites=true&w=majority&appName=Cluster0&tls=true'
try {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 10000,
    family: 4
  })
  console.log('CONNECTED via fallback URI')
  await mongoose.disconnect()
} catch (err) {
  console.error('FALLBACK CONNECT ERROR:', err.message)
  console.error(err.stack.split('\n').slice(0,5).join('\n'))
  process.exit(1)
}

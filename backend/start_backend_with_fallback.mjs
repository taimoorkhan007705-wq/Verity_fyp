import { spawn } from "child_process";
const fallback = "mongodb://taimoorkhan:th7071705@ac-plohefn-shard-00-00.cdtghag.mongodb.net:27017,ac-plohefn-shard-00-01.cdtghag.mongodb.net:27017,ac-plohefn-shard-00-02.cdtghag.mongodb.net:27017/?appName=Cluster0";
console.log('Starting backend with fallback URI');
const child = spawn(process.execPath, ['server.js'], {
  cwd: process.cwd(),
  env: { ...process.env, MONGODB_URI: fallback, NODE_ENV: 'development' },
  detached: true,
  stdio: 'ignore'
});
child.unref();
console.log('Spawned backend pid', child.pid);

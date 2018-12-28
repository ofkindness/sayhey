const fs = require('fs');
const Redis = require('ioredis');
const path = require('path');

const srandmember = fs.readFileSync(path.join(__dirname, '/lua/srandmember.lua'), 'utf8');
const tomatoholders = fs.readFileSync(path.join(__dirname, '/lua/tomatoholders.lua'), 'utf8');


let redisClient;

if (['development', 'staging', 'production'].includes(process.env.NODE_ENV)) {
  redisClient = new Redis(process.env.REDIS_URL);

  redisClient.defineCommand('koka_srandmember', {
    numberOfKeys: 2,
    lua: srandmember
  });

  redisClient.defineCommand('tomatoholders', {
    numberOfKeys: 2,
    lua: tomatoholders
  });
}


module.exports = { redisClient };

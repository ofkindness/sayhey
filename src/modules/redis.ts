import { config } from 'dotenv';
import fs from 'fs';
import Redis from 'ioredis';
import path from 'path';

config();

const srandmember = fs.readFileSync(path.join(__dirname, '/lua/srandmember.lua'), 'utf8');
const tomatoholders = fs.readFileSync(path.join(__dirname, '/lua/tomatoholders.lua'), 'utf8');

const redisClient = new Redis(process.env.REDIS_URL);

const { NODE_ENV = 'development' } = process.env;

if (['development', 'staging', 'production'].includes(NODE_ENV)) {
  redisClient.defineCommand('srandmember', {
    numberOfKeys: 2,
    lua: srandmember,
  });

  redisClient.defineCommand('tomatoholders', {
    numberOfKeys: 2,
    lua: tomatoholders,
  });
}

export default redisClient;

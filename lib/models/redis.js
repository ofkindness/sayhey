import Redis from 'ioredis';
import denv from 'denv';
import fs from 'fs';
import path from 'path';

const d = denv();

const conString = `redis://${d.env('redis_user', '')}:${d.env('redis_password', '')}@${d.addr('127.0.0.1')}:${d.port('6379')}/${d.env('db', 0)}`;


const srandmember = fs.readFileSync(path.join(__dirname, '/../lua/srandmember.lua'), 'utf8');
const tomatoholders = fs.readFileSync(path.join(__dirname, '/../lua/tomatoholders.lua'), 'utf8');


const client = new Redis(conString);

client.defineCommand('koka_srandmember', {
  numberOfKeys: 2,
  lua: srandmember
});

client.defineCommand('tomatoholders', {
  numberOfKeys: 2,
  lua: tomatoholders
});

export default client;

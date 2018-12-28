-- SRANDMEMBER key [count]
local res = {}
local len = redis.call('SCARD', KEYS[1])

if(len == 0)
then
  return res
end

local arr = redis.call('SMEMBERS', KEYS[1])
local count = tonumber(KEYS[2])

if(count == nil)
then
  count = 1
end

local time = redis.call('TIME')
local seed = bit.bxor(time[1], time[2])

math.randomseed(seed)

for i=count,0,-1
do
  res[i] = arr[math.random(len)]
end

return res

-- TOMATOHOLDERS key [count]
local res = {}
local len = redis.call('SCARD', KEYS[1])

if(len == 0)
then
  return res
end

local arr = redis.call('SMEMBERS', KEYS[1])

local count = tonumber(KEYS[2])

if (count == nil or count > table.getn(arr))
then
  count = table.getn(arr)
end

for i=0,count
do
  res[i*2] = redis.call('HGET', tostring(arr[i]), 'username')
  res[i*2+1] = redis.call('HGET', tostring(arr[i]), 'tomatos')
end

return res

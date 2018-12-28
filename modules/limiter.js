const { RateLimiter } = require('limiter');

const limiters = {};

module.exports = (key) => {
  if (!limiters[key]) {
    limiters[key] = new RateLimiter(1, 'hour', true);
  }

  return limiters[key].tryRemoveTokens(1);
};

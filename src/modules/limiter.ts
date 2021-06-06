const { RateLimiter } = require('limiter');

const limiters: {
  [key: string]: any;
} = {};

export default (key: string) => {
  if (!limiters[key]) {
    limiters[key] = new RateLimiter(1, 'hour', true);
  }

  return limiters[key].tryRemoveTokens(1);
};

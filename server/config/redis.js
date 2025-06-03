import Redis from "ioredis";
import { RateLimiterRedis } from "rate-limiter-flexible";
const redisClient = new Redis(process.env.REDIS_URL);

// Rate limiter for message sending
export const messageRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rl_sendMessage",
  points: 5, // allow 5 messages
  duration: 10, // per 10 seconds
});



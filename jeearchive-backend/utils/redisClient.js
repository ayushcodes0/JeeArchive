/* 

    This is redisClient.js page inside utils folder.
    It is the setup file to use the redisClient for caching the data, so that user can get the data as fast as possible.

*/

// importing createClient from redis, dotenv
const { createClient } = require('redis');
require('dotenv').config();


const redisClient = createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));

(async () => {
  try {
    await redisClient.connect();
    console.log('Redis connected successfully');
  } catch (err) {
    console.error('Redis connection error:', err);
  }
})();

module.exports = redisClient;

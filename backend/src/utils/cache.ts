import { redisClient } from "../config/redis.js";

export const invalidatePostCaches = async (username?: string) => {
  try {
    await redisClient.del("home:posts");

    if (username) {
      await redisClient.del(`user:posts:${username}`);
    }
  } catch (error) {
    console.log("Cache invalidation failed: ", error);
  }
};

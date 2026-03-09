import { createClient } from "redis";
import { RADIS_URI } from "../../config/config.service.js";

export const redisClient = createClient({
  url: RADIS_URI,
});

export const radisConnection = async () => {
  try {
    await redisClient.connect();
    console.log("radis connected👌");
  } catch (error) {
    console.log("Error to connect", error);
  }
};

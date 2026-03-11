import { redisClient } from "../../DB/radis.connection.db.js";
import { emailEnum } from "../enums/email.enum.js";
// | Value | Meaning            |
// | ----- | ------------------ |
// | `> 0` | seconds left       |
// | `-1`  | no expiration      |
// | `-2`  | key does not exist |

//REVOKE_TOKEN

export const baseRevokeTokenKey = (userId) => {
  return `user:RevokeToken:${userId}`;
};

export const revokeTokenKey = ({ userId, jti } = {}) => {
  return `${baseRevokeTokenKey(userId)}:${jti}`;
};

export const redisOtp = ({ email, subject = emailEnum.confirmEmail }) => {
  return `OTP:Code:${email}:${subject}`;
};

export const maxAttemptOtp = ({ email, subject = emailEnum.confirmEmail }) => {
  return `${redisOtp({ email, subject })}:maxAttempt`;
};

export const blockUser = ({ email, subject = emailEnum.confirmEmail }) => {
  return `${redisOtp({ email, subject })}:blockUser`;
};

export const set = async (key, value, ttl) => {
  try {
    const data = typeof value === "string" ? value : JSON.stringify(value);

    if (ttl && Number.isInteger(ttl)) {
      // TTL in seconds
      await redisClient.setEx(key, ttl, data);
    } else {
      await redisClient.set(key, data);
    }

    return true;
  } catch (error) {
    console.error("Redis SET error:", error);
    return false;
  }
};
export const get = async (key) => {
  try {
    const data = await redisClient.get(key);
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  } catch (error) {
    console.error("Redis GET error:", error);
    return null;
  }
};

export const update = async (key, value, ttl = null) => {
  try {
    const exists = await redisClient.exists(key);
    if (!exists) return false;
    return await redisClient.set(key, value, ttl);
  } catch (error) {
    console.error("Redis UPDATE error:", error);
    return false;
  }
};

export const deleteKey = async (key) => {
  try {
    const result = await redisClient.del(key);
    return result === 1;
  } catch (error) {
    console.error("Redis DELETE error:", error);
    return false;
  }
};

export const expire = async (key, ttl) => {
  try {
    const result = await redisClient.expire(key, ttl);
    return result === 1;
  } catch (error) {
    console.error("Redis EXPIRE error:", error);
    return false;
  }
};

export const ttl = async (key) => {
  try {
    return await redisClient.ttl(key);
  } catch (error) {
    console.error("Redis TTL error:", error);
    return -2;
  }
};

export const incr = async (key) => {
  try {
    return await redisClient.incr(key);
  } catch (error) {
    console.error("Redis incr error:", error);
    return -2;
  }
};

export const allKeysByPrefix = async (baseKey) => {
  return await redisClient.keys(`${baseKey}*`);
};

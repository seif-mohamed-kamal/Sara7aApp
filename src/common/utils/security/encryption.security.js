import crypto from "node:crypto";
import { ENCRYPT_KEY } from "../../../../config/config.service.js";

const key = ENCRYPT_KEY;

export const generateEncrypt =async (plainText) => {
  const iv = crypto.randomBytes(16);
  const cipherIv = crypto.createCipheriv("aes-256-cbc", ENCRYPT_KEY, iv);
  let encrypted = cipherIv.update(plainText, "utf8", "hex");
  encrypted += cipherIv.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

export const generateDecrypt = async(cipherText) => {
  const [ iv, encryptedData ] = cipherText.split(":") || [];
  const ivBuffer = Buffer.from(iv, 'hex');
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, ivBuffer);
  let plainText = decipher.update(encryptedData, "hex", "utf8");
  plainText += decipher.final("utf8");
  return plainText;
};

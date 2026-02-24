import { hash, compare, genSalt } from "bcrypt";
import * as argon2 from "argon2";
import { SALT_ROUND } from "../../../../config/config.service.js";
import { hashAbroachEnum } from "../../enums/security.enum.js";

export const generateHash = async ({
  plainText,
  salt = SALT_ROUND,
  minor = "b",
  approach = hashAbroachEnum.bcyrpt,
} = {}) => {
  let hashValue;
  switch (approach) {
    case hashAbroachEnum.argon2:
      hashValue = await argon2.hash(plainText);
      break;
    default:
      const generatedSalt = await genSalt(salt);
      hashValue = await hash(plainText, generatedSalt);
      break;
  }
  return hashValue;
};

export const compareHash = async ({
  plainText,
  cipherText,
  approach = hashAbroachEnum.bcyrpt,
} = {}) => {
  let match = false;
  switch (approach) {
    case hashAbroachEnum.argon2:
      match = await argon2.verify(cipherText, plainText);
      break;
    default:
      match = await compare(plainText, cipherText);
      break;
  }
  return match;
};

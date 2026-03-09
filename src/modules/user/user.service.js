import {
  ConflictException,
  NotFoundException,
} from "../../common/utils/index.js";
import { createLoginCreadintials } from "../../common/utils/security/token.security.js";
import multer from "multer";
import { createOne, deleteOne, findOne } from "../../DB/DB.repositry.js";
import { usermodel } from "../../DB/model/user.model.js";
import { logoutEnum } from "../../common/enums/security.enum.js";
import { tokenModel } from "../../DB/model/token.model.js";
import { JWT_EXPIRES_IN } from "../../../config/config.service.js";
import {
  allKeysByPrefix,
  baseRevokeTokenKey,
  deleteKey,
  revokeTokenKey,
  set,
} from "../../common/service/redis.service.js";
export const profile = async (user) => {
  return user;
};
const createRevokeToken = async ({ userId, jti, ttl } = {}) => {
  // console.log(revokeTokenKey({ userId, jti }));
  // console.log({ userId, jti, ttl });
  await set(revokeTokenKey({ userId, jti }), jti, ttl);
  return;
};
export const rotateToken = async (user, issuer, { jti, iat, sub }) => {
  if ((iat + 60 * 60 * 24 * 365) * 1000 >= Date.now() + 5 * 60 * 1000) {
    throw ConflictException({ message: "Current access token still valid" });
  }
  await createRevokeToken({
    userId: sub,
    jti,
    ttl: iat + 60 * 60 * 24 * 365,
  });
  return await createLoginCreadintials(user, issuer);
};

export const profileImg = async (file, user) => {
  user.profilePicture = file.finalPath;
  user.save();
  return user;
};

export const coverImg = async (files, user) => {
  user.coverProfilePicture = files.map((file) => file.finalPath);
  user.save();
  return user;
};

export const logout = async (flag, user, { jti, iat, sub }) => {
  // console.log({ jti, iat });
  let status = 200;
  switch (flag) {
    case logoutEnum.All:
      user.changeCredentialsTime = new Date();
      await user.save();
      await deleteKey(await allKeysByPrefix(baseRevokeTokenKey(sub)));
      break;
    default:
      // console.log({ fun: allKeysByPrefix(baseRevokeTokenKey(sub)) });
      // console.log({ sub });
      await createRevokeToken({
        userId: sub,
        jti,
        ttl: iat + 60 * 60 * 24 * 365,
      });
      status = 201;
      break;
  }
  return status;
};

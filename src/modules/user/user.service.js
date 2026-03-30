import {
  BadException,
  compareHash,
  ConflictException,
  generateDecrypt,
  generateHash,
  NotFoundException,
  otpEmailTemplate,
  sendEmail,
  UnAuthrizedException,
} from "../../common/utils/index.js";
import {
  createLoginCreadintials,
  decodeToken,
} from "../../common/utils/security/token.security.js";
import multer from "multer";
import {
  createOne,
  deleteMany,
  deleteOne,
  findOne,
} from "../../DB/DB.repositry.js";
import { usermodel } from "../../DB/model/user.model.js";
import { logoutEnum, TokenTypeEnum } from "../../common/enums/security.enum.js";
import { tokenModel } from "../../DB/model/token.model.js";
import {
  JWT_EXPIRES_IN,
  JWT_SECRET_RESET,
} from "../../../config/config.service.js";
import {
  allKeysByPrefix,
  baseRevokeTokenKey,
  deleteKey,
  revokeTokenKey,
  set,
  resetTokenKey,
  get,
  baseUnconfirmedUser,
  unconfirmedUser,
  exists,
} from "../../common/service/redis.service.js";
import jwt from "jsonwebtoken";

export const profile = async (user) => {
  return user;
};

export const shareProfile = async (userId) => {
  const account = await findOne({
    model: usermodel,
    filter: {
      _id: userId,
    },
    select: "-password -visited",
  });
  if (!account) {
    throw NotFoundException({ message: "User Not Found" });
  }
  account.visited += 1;
  await account.save();
  if (account.phone) {
    account.phone = await generateDecrypt(account.phone);
  }
  return account;
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
  if (user.profilePicture) {
    user.galary.push(user.profilePicture);
  }
  user.profilePicture = file.finalPath;
  user.save();
  return user;
};

export const coverImg = async (files, user) => {
  files.map((file) => user.coverProfilePicture.push(file.finalPath));
  user.save();
  return user;
};

export const logout = async (flag, user, { jti, iat, sub }) => {
  // console.log({ jti, iat });
  let status = 200;
  // console.log({ sub });

  switch (flag) {
    case logoutEnum.All:
      user.changeCredentialsTime = new Date();
      await user.save();
      const tokenkeys = await allKeysByPrefix(baseRevokeTokenKey(sub));
      // console.log({ tokenkeys });
      if (tokenkeys.length) {
        await deleteKey(tokenkeys);
      }
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

export const updatePassword = async (inputs, user, issuer) => {
  const { oldPassword, newPassword } = inputs;
  if (
    !(await compareHash({ plainText: oldPassword, cipherText: user.password }))
  ) {
    throw ConflictException({ message: "invalid old password" });
  }
  user.password = await generateHash({ plainText: newPassword });
  user.changeCredentialsTime = new Date();
  await user.save();
  await deleteKey(await allKeysByPrefix(baseRevokeTokenKey(user._id)));
  return await createLoginCreadintials(user, issuer);
};

export const forgetPassword = async ({ email }, issuer) => {
  const account = await findOne({
    model: usermodel,
    filter: {
      email,
    },
  });
  if (!account) {
    throw NotFoundException({ message: "user Not Found" });
  }
  const resetToken = await createLoginCreadintials(
    account,
    issuer,
    TokenTypeEnum.reset
  );
  // console.log({ resetToken });
  // console.log(jwt.decode(resetToken));
  const { user, decodedToken } = await decodeToken({
    token: resetToken,
    tokenType: TokenTypeEnum.reset,
  });
  // console.log({ user, decodedToken });
  const { jti, iat, sub } = decodedToken;
  // console.log({ jti, iat, sub });
  await set(resetTokenKey(email), jti, iat + 60 * 15);
  await sendEmail({
    to: email,
    cc: email,
    subject: "Your Reset Token",
    html: otpEmailTemplate({ otp: resetToken, subject: "Your Reset Token" }),
  });
  return "CHECK YOUR EMAIL";
};

export const resetPasswordverify = async ({ email, token, password }) => {
  const account = await findOne({
    model: usermodel,
    filter: {
      email,
    },
  });
  if (!account) {
    throw NotFoundException({ message: "user Not Found" });
  }
  const verfyToken = await jwt.verify(token, JWT_SECRET_RESET);
  if (!verfyToken) {
    throw ConflictException({ message: "token not verifyed" });
  }
  const resetToken = await get(resetTokenKey(email));
  if (!resetToken) {
    throw NotFoundException({ message: "expired Token" });
  }
  const decodedToken = await jwt.decode(token);
  const { jti } = decodedToken;
  if (jti != resetToken) {
    throw UnAuthrizedException({ message: "Invalid Token" });
  }
  account.password = await generateHash({ plainText: password });
  await account.save();
  await deleteKey(await allKeysByPrefix(resetTokenKey(email)));
  return account;
};


export const deleteUnconfirmedUsers = async () => {
  const users = await usermodel.find({
    confirmEmail: { $exists: false },
  });

  let userDeleted = [];
  let userStillHaveTTL = [];

  for (const user of users) {
    const key = unconfirmedUser(user.email);
    const isExsist = await exists(key);
    if (!isExsist) {
      await deleteOne({
        model: usermodel,
        filter: { email: user.email },
      });
      userDeleted.push(user.email)
    } else {
      userStillHaveTTL.push(user.email)
    }
  }

  return{userDeleted , userStillHaveTTL};
};
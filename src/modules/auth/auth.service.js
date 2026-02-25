import {
  compareHash,
  ConflictException,
  generateDecrypt,
  generateEncrypt,
  generateHash,
  NotFoundException,
  sendOTP,
} from "../../common/utils/index.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import { create, createOne, findOne } from "../../DB/DB.repositry.js";
import { usermodel } from "../../DB/model/user.model.js";
import {
  JWT_SECRET,
  JWT_SECRET_ADMIN,
} from "../../../config/config.service.js";
import { createLoginCreadintials } from "../../common/utils/security/token.security.js";
import { providerEnum } from "../../common/enums/user.enum.js";

export const signup = async (inputs) => {
  const { firstName, lastName, email, password, phone, role } = inputs;

  const checkEmail = await findOne({
    model: usermodel,
    filter: { email },
  });
  if (checkEmail) {
    throw ConflictException({ message: "Duplicated Email" });
  }
  const otp = Math.floor(100000 + Math.random() * 900000);
  await sendOTP(email, otp);

  const user = await createOne({
    model: usermodel,
    data: {
      firstName,
      lastName,
      email,
      role,
      password: await generateHash({ plainText: password }),
      phone: await generateEncrypt(phone),
    },
  });

  return user;
};

export const login = async (inputs, issuer) => {
  const { email, password } = inputs;
  const user = await findOne({
    model: usermodel,
    filter: { email },
  });
  if (!user) {
    throw NotFoundException({ message: "Invalid login credintials" });
  }
  if (
    !(await compareHash({ plainText: password, cipherText: user.password }))
  ) {
    throw NotFoundException({ message: "Invalid login credintials" });
  }
  return await createLoginCreadintials(user, issuer);
};

const verifyGoogleAccount = async (idToken) => {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience:
      "920851061985-v8jgoddrenaodbku25tfadgg4a83qs43.apps.googleusercontent.com", // Specify the WEB_CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  // console.log(payload);
  return payload;
};

/* 
{
  iss: 'https://accounts.google.com',
  azp: '920851061985-v8jgoddrenaodbku25tfadgg4a83qs43.apps.googleusercontent.com',
  aud: '920851061985-v8jgoddrenaodbku25tfadgg4a83qs43.apps.googleusercontent.com',
  sub: '113897473099796852536',
  email: 'seifm9067@gmail.com',
  email_verified: true,
  nbf: 1772057399,
  name: 'seif mohamed',
  picture: 'https://lh3.googleusercontent.com/a/ACg8ocKnSV6QrzzoI1RoUQKff_raPTe2c9FDkK3_F8Rjq8m5vdDrxbf2=s96-c',
  given_name: 'seif',
  family_name: 'mohamed',
  iat: 1772057699,
  exp: 1772061299,
  jti: '50eeae7bb5410203916e4d7ff5d4bbbf3b5b8668'
}
*/
export const signupWithGmail = async (idToken, issuer) => {
  // console.log(idToken);
  const payload = await verifyGoogleAccount(idToken);
  // console.log(payload);

  const checkEmailExist = await findOne({
    model: usermodel,
    filter: { email: payload.email },
  });
  if (checkEmailExist) {
    if (checkEmailExist.provider != providerEnum.google) {
      throw new ConflictException({ message: "invalid login provider" });
    }
    return { status: 200, credintials: await loginWithGmail(idToken, issuer) };
  }
  const user = await createOne({
    model: usermodel,
    data: {
      firstName: payload.given_name,
      lastName: payload.family_name,
      email: payload.email,
      profilePicture: payload.picture,
      provider: providerEnum.google,
    },
  });
  return {
    status: 201,
    credintials: await createLoginCreadintials(user, issuer),
  };
};

export const loginWithGmail = async (idToken, issuer) => {
  console.log(idToken);
  const payload = await verifyGoogleAccount(idToken);
  console.log(payload);

  const user = await findOne({
    model: usermodel,
    filter: { email: payload.email, provider: providerEnum.google },
  });
  console.log(user)
  if (!user) {
    throw new NotFoundException({ message: "user Not registred" });
  }

  return await createLoginCreadintials(user, issuer);
};

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

import { create, createOne, findOne } from "../../DB/DB.repositry.js";
import { usermodel } from "../../DB/model/user.model.js";
import {
  JWT_SECRET,
  JWT_SECRET_ADMIN,
} from "../../../config/config.service.js";
import { createLoginCreadintials } from "../../common/utils/security/token.security.js";

export const signup = async (inputs) => {
  const { firstName, lastName, email, password, phone ,role} = inputs;

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
  return await createLoginCreadintials(user, issuer)
};
  
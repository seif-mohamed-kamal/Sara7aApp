import { NotFoundException } from "../../common/utils/index.js";
import { createLoginCreadintials } from "../../common/utils/security/token.security.js";
import multer from "multer";
import { findOne } from "../../DB/DB.repositry.js";
import { usermodel } from "../../DB/model/user.model.js";
export const profile = async (user) => {
  return user;
};

export const rotateToken = async (id, issuer) => {
  return await createLoginCreadintials(user, issuer);
};

export const uploadImg = async (id, file) => {
  if (!file) throw NotFoundException({ message: "No file uploaded" });
  const user = await findOne({
    model: usermodel,
    filter: { _id: id },
  });
  if (!user) {
    throw NotFoundException({ message: "user not found" });
  }
  user.profilePicture = file.path;
  await user.save();
  return "image uploaded succesfully"
};
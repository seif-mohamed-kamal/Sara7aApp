import joi from "joi";
import { fileExtention } from "../../common/utils/multer/validatio.multer.js";
import { generalValidationFeild } from "../../common/utils/validation.js";

export const profileSchema = {
  file: joi
    .object()
    .keys({
      fieldname: joi.string().required(),
      originalname: joi.string().required(),
      encoding: joi.string().required(),
      mimetype: joi
        .string()
        .valid(...Object.values(fileExtention.image))
        .required(),
      finalPath: joi.string().required(),
      destination: joi.string().required(),
      filename: joi.string().required(),
      path: joi.string().required(),
      size: joi.number(),
    })
    .required(),
};

export const coverSchema = {
  files: joi
    .array()
    .items(
      joi
        .object()
        .keys({
          fieldname: joi.string().required(),
          originalname: joi.string().required(),
          encoding: joi.string().required(),
          mimetype: joi
            .string()
            .valid(...Object.values(fileExtention.image))
            .required(),
          finalPath: joi.string().required(),
          destination: joi.string().required(),
          filename: joi.string().required(),
          path: joi.string().required(),
          size: joi.number(),
        })
        .required()
    )
    .min(1)
    .max(3)
    .required(),
};

export const updatePasswordSchema = {
  body: joi.object().keys({
    oldPassword: generalValidationFeild.password.required(),
    newPassword: generalValidationFeild.password
      .not(joi.ref("oldPassword"))
      .required(),
    confirmPassword: generalValidationFeild.confirmPassword("newPassword"),
  }),
};

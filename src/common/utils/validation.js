import joi from "joi";
import { Types } from "mongoose";
import { fileExtention } from "./multer/validatio.multer.js";

// const trainSchema = joi.object().keys({
//     firstName: joi.string().min(5).max(25).alphanum().required().messages({
//       "any.required": "FirstName is Required",
//       "string.empty": "FirstName cannot be Empty",
//     }),
//     gender: joi.string().valid("male", "female").insensitive().required(),
//     age: joi.number().min(18).max(60).integer().required(),
//     confirmEmail: joi
//       .boolean()
//       .truthy(1, "1")
//       .falsy(0, "0")
//       .sensitive()
//       .required(),
//     colors: joi
//       .array()
//       .min(1)
//       .max(5)
//       .items(joi.string().required(), joi.number())
//       .single()
//       .required(),
//     militaryDate: joi.date().when("gender", {
//       is: "male",
//       then: joi.required(),
//       otherwise: joi.forbidden(),
//     }),
//   }).required();

export const generalValidationFeild = {
  email: joi.string().email({
    minDomainSegments: 2,
    maxDomainSegments: 3,
    tlds: { allow: ["com", "net"] },
  }),
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,16}$/)),
  firstName: joi.string().min(5).max(25).alphanum().messages({
    "any.required": "FirstName is Required",
    "string.empty": "FirstName cannot be Empty",
  }),
  lastName: joi.string().min(5).max(25).alphanum().messages({
    "any.required": "LastName is Required",
    "string.empty": "LastName cannot be Empty",
  }),
  confirmPassword: function (path = "password") {
    return joi.string().valid(joi.ref(path));
  },
  gender: joi.string().valid("male", "female").insensitive(),
  id: joi.string().custom((value, helper) => {
    return Types.ObjectId.isValid(value)
      ? true
      : helper.message("Invalid ObjectId");
  }),
  phone: joi.string(),
  files: function (validation = []) {
    return joi.object().keys({
      fieldname: joi.string().required(),
      originalname: joi.string().required(),
      encoding: joi.string().required(),
      mimetype: joi
        .string()
        .valid(...Object.values(validation))
        .required(),
      finalPath: joi.string().required(),
      destination: joi.string().required(),
      filename: joi.string().required(),
      path: joi.string().required(),
      size: joi.number(),
    });
  },
};

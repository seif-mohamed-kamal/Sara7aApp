import joi from "joi";
import { generalValidationFeild } from "../../common/utils/validation.js";

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

export const loginSchema = {
  body: joi
    .object()
    .keys({
      email: generalValidationFeild.email.required(),
      password: generalValidationFeild.password.required(),
    })
    .required(),
};

export const signupSchema = {
  body: loginSchema.body
    .append()
    .keys({
      firstName: generalValidationFeild.firstName.required(),
      lastName: generalValidationFeild.lastName.required(),
      confirmPassword: generalValidationFeild.confirmPassword("password").required(),
      phone: generalValidationFeild.phone.required(),
      two_step_verefication:joi.boolean().required()
    })
    .required(),
};

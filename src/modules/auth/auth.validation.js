import joi from "joi";

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
  body: joi.object().keys({
      email: joi.string().email({minDomainSegments: 2,maxDomainSegments: 3,tlds: { allow: ["com", "net"] },}).required(),
      password: joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,16}$/)).required(),}).required(),
};

export const signupSchema = {
  body: loginSchema.body.append().keys({
      firstName: joi.string().min(5).max(25).alphanum().required().messages({
        "any.required": "FirstName is Required",
        "string.empty": "FirstName cannot be Empty",
      }),
      lastName: joi.string().min(5).max(25).alphanum().required().messages({
        "any.required": "LastName is Required",
        "string.empty": "LastName cannot be Empty",
      }),
      confirmPassword: joi.string().valid(joi.ref("password")).required(),
      phone:joi.string()
    }).required(),

  query: joi.object().keys({
      lang: joi.string().valid("ar", "en"),
    }),
};

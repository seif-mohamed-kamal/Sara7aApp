import joi from "joi";
import { generalValidationFeild } from "../../common/utils/validation.js";
import { fileExtention } from "../../common/utils/multer/validatio.multer.js";

export const messageSchema = {
  params: joi.object().keys({
    recieverId: generalValidationFeild.id.required(),
  }),
  body: joi.object().keys({
    content: joi.string().max(10000).min(0),
  }),
  files: joi
    .array()
    .items(generalValidationFeild.files(fileExtention.image))
    .min(0)
    .max(2),
};

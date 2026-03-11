import { Router } from "express";
import { cofirmEmail, login, resendConfirmEmail, signup, signupWithGmail } from "./auth.service.js";
import { BadException, successResponse } from "../../common/utils/index.js";
import { validation } from "../../middleware/validatio.miidleware.js";
import { loginSchema, signupSchema } from "./auth.validation.js";
const router = Router();

router.post("/signup",validation(signupSchema), async (req, res, next) => {
  const result = await signup(req.body);
  return successResponse({ res, status: 201, data: result });
});

router.post("/signup/gmail", async (req, res, next) => {
  const {idToken} = req.body
  const {status , credintials} = await signupWithGmail(idToken ,`${req.protocol}://${req.host}` );
  return successResponse({ res, status, data: {...credintials} });
});


router.post("/login",validation(loginSchema), async (req, res, next) => {
  const result = await login(req.body ,`${req.protocol}://${req.host}`);
  return successResponse({ res, status: 200, data: result });
});


router.patch("/confirmEmail", async (req, res, next) => {
  const{email , otp} = req.body
  const result = await cofirmEmail(email , otp);
  return successResponse({ res, status: 200, data: result });
});

router.patch("/resendOtp", async (req, res, next) => {
  const{email} = req.body
  const result = await resendConfirmEmail(email);
  return successResponse({ res, status: 200, data: result });
});


export default router;

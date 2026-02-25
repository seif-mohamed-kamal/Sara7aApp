import { Router } from "express";
import { login, signup, signupWithGmail } from "./auth.service.js";
import { successResponse } from "../../common/utils/index.js";
const router = Router();

router.post("/signup", async (req, res, next) => {
  const result = await signup(req.body);
  return successResponse({ res, status: 201, data: result });
});
router.post("/signup/gmail", async (req, res, next) => {
  const {idToken} = req.body
  const {status , credintials} = await signupWithGmail(idToken ,`${req.protocol}://${req.host}` );
  return successResponse({ res, status, data: {...credintials} });
});


router.post("/login", async (req, res, next) => {
  const result = await login(req.body ,`${req.protocol}://${req.host}`);
  return successResponse({ res, status: 200, data: result });
});



export default router;

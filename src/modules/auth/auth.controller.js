import { Router } from "express";
import { login, signup } from "./auth.service.js";
import { successResponse } from "../../common/utils/index.js";
const router = Router();
router.post("/signup", async (req, res, next) => {
  const result = await signup(req.body);
  return successResponse({ res, status: 201, data: result });
});

router.post("/login", async (req, res, next) => {
  const result = await login(req.body ,`${req.protocol}://${req.host}`);
  return successResponse({ res, status: 200, data: result });
});



export default router;

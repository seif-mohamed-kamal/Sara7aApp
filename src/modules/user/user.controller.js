import { Router } from "express";
import { profile, rotateToken } from "./user.service.js";
import { successResponse } from "../../common/utils/index.js";
const router = Router();

router.get("/", async (req, res, next) => {
  // console.log(req.user.sub)
  const result = await profile(req.headers.authorization);
  return successResponse({ res, status: 200, data: result });
});

router.get("/rotate-token", async (req, res, next) => {
  const result = await rotateToken(req.headers.authorization, `${req.protocol}://${req.host}`);
  return successResponse({ res, status: 200, data: result });
});

export default router;

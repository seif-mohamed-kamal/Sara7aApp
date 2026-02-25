import { Router } from "express";
import { profile, rotateToken } from "./user.service.js";
import { successResponse } from "../../common/utils/index.js";
import { authintication } from "../../middleware/auth.middleware.js";
import { TokenTypeEnum } from "../../common/enums/security.enum.js";
const router = Router();

router.get("/", authintication(), async (req, res, next) => {
  // console.log(req.user.sub)
  const result = await profile(req.user);
  return successResponse({ res, status: 200, data: result });
});

router.get(
  "/rotate-token",
  authintication({ tokenType: TokenTypeEnum.refresh }),
  async (req, res, next) => {
    const result = await rotateToken(
      req.user,
      `${req.protocol}://${req.host}`
    );
    return successResponse({ res, status: 200, data: result });
  }
);

export default router;

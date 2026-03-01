import { Router } from "express";
import { profile, rotateToken, uploadImg } from "./user.service.js";
import { successResponse } from "../../common/utils/index.js";
import {
  authintication,
  authrization,
} from "../../middleware/auth.middleware.js";
import { TokenTypeEnum } from "../../common/enums/security.enum.js";
import { endpoint } from "./user.authrize.js";
import multer from "multer";
import { upload } from "../../middleware/multer.miidleware.js";
const router = Router()

router.get(
  "/",
  authintication(),
  authrization(endpoint.profile),
  async (req, res, next) => {
    // console.log(req.user.sub)
    const result = await profile(req.user);
    return successResponse({ res, status: 200, data: result });
  }
);

router.get(
  "/rotate-token",
  authintication({ tokenType: TokenTypeEnum.refresh }),
  async (req, res, next) => {
    const result = await rotateToken(req.user, `${req.protocol}://${req.host}`);
    return successResponse({ res, status: 200, data: result });
  }
);

router.post("/upload-img/:id",upload.single("file"),async (req, res, next) => {
  const id = req.params.id
  const result = await uploadImg(id, req.file);
    return successResponse({
      res,
      status: 200,
      data: result,
    });
  }
);

export default router;

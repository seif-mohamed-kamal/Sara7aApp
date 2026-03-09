import { Router } from "express";
import { coverImg, logout, profile, profileImg, rotateToken } from "./user.service.js";
import { localFileUpload, successResponse } from "../../common/utils/index.js";
import { TokenTypeEnum } from "../../common/enums/index.js";
import { endpoint } from "./user.authrize.js";
import {
  authintication,
  authrization,
  validation,
} from "../../middleware/index.js";
import { fileExtention } from "../../common/utils/multer/validatio.multer.js";
import { coverSchema, profileSchema } from "./user.validation.js";
const router = Router();

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
    const result = await rotateToken(req.user, `${req.protocol}://${req.host}`, req.decoded);
    return successResponse({ res, status: 200, data: result });
  }
);

router.patch(
  "/upload/profile-picture",
  authintication(),
  localFileUpload({
    folderName: "profileImg",
    validation: fileExtention.image,
  }).single("file"),
  validation(profileSchema),
  async (req, res, next) => {
    const result = await profileImg(req.file, req.user);
    return successResponse({
      res,
      status: 200,
      data: req.file,
    });
  }
);

router.patch(
  "/upload/cover-picture",
  authintication(),
  localFileUpload({
    folderName: "coverImg",
    validation: fileExtention.image,
  }).array("files"),
  validation(coverSchema),
  async (req, res, next) => {
    const result = await coverImg(req.files, req.user);
    return successResponse({
      res,
      status: 200,
      data: result,
    });
  }
);

router.post("/logout", authintication(), async (req, res, next) => {
  const { flag } = req.body;
  // console.log(req.user.sub)
  const result = await logout(flag, req.user, req.decoded);
  return successResponse({ res, status: result });
});

export default router;

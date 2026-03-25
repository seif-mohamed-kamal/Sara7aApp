import { Router } from "express";
import {
  coverImg,
  deleteUnconfirmedUsers,
  forgetPassword,
  logout,
  profile,
  profileImg,
  resetPasswordverify,
  rotateToken,
  shareProfile,
  updatePassword,
} from "./user.service.js";
import { localFileUpload, successResponse } from "../../common/utils/index.js";
import { TokenTypeEnum } from "../../common/enums/index.js";
import { endpoint } from "./user.authrize.js";
import {
  authintication,
  authrization,
  validation,
} from "../../middleware/index.js";
import { fileExtention } from "../../common/utils/multer/validatio.multer.js";
import * as validators from "./user.validation.js";
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

router.get("/share-profile/:userId", async (req, res, next) => {
  // console.log(req.user.sub)
  const result = await shareProfile(req.params.userId);
  return successResponse({ res, status: 200, data: result });
});

router.get(
  "/rotate-token",
  authintication({ tokenType: TokenTypeEnum.refresh }),
  async (req, res, next) => {
    const result = await rotateToken(
      req.user,
      `${req.protocol}://${req.host}`,
      req.decoded
    );
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
  validation(validators.profileSchema),
  async (req, res, next) => {
    const result = await profileImg(req.file, req.user);
    return successResponse({
      res,
      status: 200,
      data: { result },
    });
  }
);

router.patch(
  "/upload/cover-picture",
  authintication(),
  localFileUpload({
    folderName: "coverImg",
    validation: fileExtention.image,
  }).array("files", 2),
  validation(validators.coverSchema),
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

router.post("/foreget-password-by-link", async (req, res, next) => {
  // console.log(req.user.sub)
  const result = await forgetPassword(
    req.body,
    `${req.protocol}://${req.host}`
  );
  return successResponse({ res, status: 200, data: { result } });
});

router.post("/reset-password-by-link", async (req, res, next) => {
  // console.log(req.user.sub)
  const result = await resetPasswordverify(
    req.body,
  );
  return successResponse({ res, status: 200, data: { result } });
});

router.patch(
  "/update-password",
  authintication(),
  validation(validators.updatePasswordSchema),
  async (req, res, next) => {
    const result = await updatePassword(
      req.body,
      req.user,
      `${req.protocol}://${req.host}`
    );
    return successResponse({
      res,
      status: 200,
      data: result,
    });
  }
);

router.delete(
  "/delete-unconfirmed-users",
  authintication(),
  authrization(endpoint.delteUnconfrimedUser),
  async (req, res, next) => {
    const result = await deleteUnconfirmedUsers()
    return successResponse({
      res,
      status: 200,
      data: {result},
    });
  }
);

export default router;

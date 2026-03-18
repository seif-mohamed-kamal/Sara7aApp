import { Router } from "express";
import {
  BadException,
  decodeToken,
  localFileUpload,
  successResponse,
} from "../../common/utils/index.js";
import { fileExtention } from "../../common/utils/multer/validatio.multer.js";
import * as validators from "./message.validation.js";
import { validation } from "../../middleware/validatio.miidleware.js";
import { deleteMessage, getMessage, getMessages, sendMessage } from "./messaga.services.js";
import { TokenTypeEnum } from "../../common/enums/security.enum.js";
import { authintication } from "../../middleware/auth.middleware.js";
const router = Router();

router.post(
  "/:recieverId",
  async (req, res, next) => {
    if (req.headers.authorization) {
      const { user, decodedToken } = await decodeToken({
        token: req.headers.authorization.split(" ")[1],
        tokenType: TokenTypeEnum.access,
      });
      req.user = user;
      req.decoded = decodedToken;
      console.log({user , decodedToken})
    }
    next();

  },
  localFileUpload({
    validation: fileExtention.image,
    folderName: "message",
  }).array("attachments", 2),
  validation(validators.messageSchema),
  async (req, res, next) => {
    if (!req.body?.content && !req.files?.length) {
      throw BadException({
        message: "you should send the content or upload images",
      });
    }
    const message = await sendMessage(
      req.params.recieverId,
      req.body,
      req.files,
      req.user,
    );
    return successResponse({ res, status: 201, data: { message } });
  }
);

router.get(
    "/list",
    authintication(),
    async (req, res, next) => {
      const messages = await getMessages(
        req.user,
      );
      return successResponse({ res, status: 200, data: { messages } });
    }
  );

router.get(
    "/:messageId",
    authintication(),
    async (req, res, next) => {
      const message = await getMessage(
        req.params.messageId,
        req.user,
      );
      return successResponse({ res, status: 201, data: { message } });
    }
  );

  router.delete(
    "/:messageId",
    authintication(),
    async (req, res, next) => {
      const message = await deleteMessage(
        req.params.messageId,
        req.user,
      );
      return successResponse({ res, status: 201, data: { message } });
    }
  );


export default router;

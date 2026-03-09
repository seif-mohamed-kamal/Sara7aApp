import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_SECRET_ADMIN } from "../../config/config.service.js";
import { TokenTypeEnum } from "../common/enums/security.enum.js";
import { decodeToken, ForbiddenException } from "../common/utils/index.js";

export const authintication = ({ tokenType = TokenTypeEnum.access } = {}) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    const [schema, creqdintials] = authorization.split(" ");
    const {user , decodedToken} = await decodeToken({ token: creqdintials, tokenType });
    req.user = user,
    req.decoded = decodedToken
    // console.log({user , decodedToken})
    next();
  };
};

export const authrization = (accessRoles = []) => {
  return async (req, res, next) => {
    if (!accessRoles.includes(req.user.role)) {
      throw ForbiddenException({ messaga: "Not Authorized access" });
    }
    next();
  };
};

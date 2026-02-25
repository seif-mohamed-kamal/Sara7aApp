import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_SECRET_ADMIN } from "../../config/config.service.js";
import { TokenTypeEnum } from "../common/enums/security.enum.js";
import { decodeToken } from "../common/utils/index.js";

export const authintication = ({tokenType = TokenTypeEnum.access}={})=>{
  return async(req , res , next)=>{
    const {authorization} = req.headers;
    const [schema , creqdintials] = authorization.split(" ")
    req.user = await decodeToken({token:creqdintials , tokenType});
    next() 
  }
}

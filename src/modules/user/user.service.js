import { TokenTypeEnum } from "../../common/enums/security.enum.js";
import { createLoginCreadintials, decodeToken } from "../../common/utils/security/token.security.js";
 
export const profile   =async (user)=>{
    return user
}

export const rotateToken = async (user , issuer)=>{
  return await createLoginCreadintials(user , issuer)
}
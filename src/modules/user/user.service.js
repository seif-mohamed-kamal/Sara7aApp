import { TokenTypeEnum } from "../../common/enums/security.enum.js";
import { createLoginCreadintials, decodeToken } from "../../common/utils/security/token.security.js";
 
export const profile   =async (token)=>{
   const account = await decodeToken({token , tokenType:TokenTypeEnum.access})
    return account
}

export const rotateToken = async (token , issuer)=>{
  const user = await decodeToken({token , tokenType:TokenTypeEnum.refresh})
  return await createLoginCreadintials(user , issuer)
}
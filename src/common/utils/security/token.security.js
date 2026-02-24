import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  JWT_SECRET_ADMIN,
  JWT_SECRET_ADMIN_refresh,
  JWT_SECRET_refresh,
} from "../../../../config/config.service.js";
import { findOne } from "../../../DB/DB.repositry.js";
import { usermodel } from "../../../DB/model/user.model.js";
import { ConflictException, NotFoundException } from "../response/error.response.js";
import { TokenTypeEnum } from "../../enums/security.enum.js";
import { roleEnum } from "../../enums/user.enum.js";

export const generateToken = async ({payload= {},secret= JWT_SECRET,option= {}} = {}) => {
  return jwt.sign(payload, secret, option);
};

export const verifyToken = async ({token ,secret}={})=>{
  return jwt.verify(token,secret)
}

export const detictRole=async(role)=>{
  let signatures = {accessSignature:undefined , refreshSignature:undefined}
  switch (role) {
    case roleEnum.admin:
      signatures = {accessSignature:JWT_SECRET_ADMIN , refreshSignature:JWT_SECRET_ADMIN_refresh}
      break;
  
    default:
      signatures = {accessSignature:JWT_SECRET , refreshSignature:JWT_SECRET_refresh}
      break;
  }
  // console.log({signatures})
  return {signatures}
}


export const generateTokenSignature=async({tokenType = TokenTypeEnum.access , level}={})=>{
  const { signatures } = await detictRole(level);
  const { accessSignature, refreshSignature } = signatures;
  // console.log({accessSignature,refreshSignature})
  let signature = undefined
  switch (tokenType) {
    case TokenTypeEnum.refresh:
      signature = refreshSignature
      break;
    default:
      signature = accessSignature
      break;
  }
  // console.log(signature)
  return signature
}

export const decodeToken = async({token  , tokenType = TokenTypeEnum.access}={})=>{
  const decodedToken = jwt.decode(token);
  // console.log({decodedToken});
  const [tokenApproach , level] = decodedToken.aud || []
  // console.log({tokenApproach , level});
  if(tokenType != tokenApproach){
    throw ConflictException({ message: "unexpected Token Type" });
  }
  const secret = await generateTokenSignature({tokenType:tokenApproach , level})
  // console.log({secret})
  const verifiedData = await verifyToken({token , secret});
  // console.log({verifiedData});
  const user = await findOne({model:usermodel , filter:{_id:verifiedData.sub}})
  if(!user){
    throw new NotFoundException({message:"user not found"})
  }
  return user;
}

export const createLoginCreadintials = async (user, issuer) => {
  const { signatures } = await detictRole(user.role);
  const { accessSignature, refreshSignature } = signatures;

  const Access_Token = await generateToken({
    payload: { sub: user._id },
    secret: accessSignature,
    option: {
      issuer,
      audience: [TokenTypeEnum.access , user.role],
    },
  });

  const Refresh_Token = await generateToken({
    payload: { sub: user._id },
    secret: refreshSignature,
    option: {
      issuer,
      audience: [TokenTypeEnum.refresh , user.role],
    },
  });
  
  return { Access_Token, Refresh_Token };
};

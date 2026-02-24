import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_SECRET_ADMIN } from "../../config/config.service.js";

export const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // console.log(authHeader)
    if (!authHeader) {
      throw new Error("Token is required", { cause: { status: 404 } });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new Error("Invalid token format", { cause: { status: 404 } });
    }
    const decodedHeader = jwt.decode(token);

    let secret = JWT_SECRET;
    
    if (decodedHeader.aud === "admin") {
      secret = JWT_SECRET_ADMIN;
    }
    
    const decoded = jwt.verify(token, secret);

    req.user = decoded;
    // console.log(req.user)
    next();
  } catch (error) {
    res.status(error.cause?.status || 404).json({
      message: error.message || "Invalid token",
    });
  }
};

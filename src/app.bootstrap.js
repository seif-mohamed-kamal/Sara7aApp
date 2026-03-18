import { NODE_ENV, port } from "../config/config.service.js";
import { connectDB } from "./DB/connection.db.js";
import { authRouter, messageRouter, userRouter } from "./modules/index.js";
import helmet from "helmet";
import { ipKeyGenerator, rateLimit } from 'express-rate-limit'
import express from "express";
import cors from "cors";
import { radisConnection } from "./DB/radis.connection.db.js";
async function bootstrap() {
  const app = express();
  //cors
  const origins = ["http://127.0.0.1:5500" , "http://127.0.0.1:4200" , undefined ]
  var corsOption= {
    origin:function(origin , callback){
      if(!origins.includes(origin)){
        callback(new Error("unauthrize origin" , {cause:{status:403}}) , origins)
      }else{
        callback(null , origins)
      }
    }
  }

  //rate-limit
  app.set("trust proxy" , true)
  const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, 
    limit: 3, 
    standardHeaders: 'draft-8', 
    legacyHeaders: true,
    // ipv6Subnet: 56, 
    requestPropertyName:"ratelimit",
    // skipSuccessfulRequests:true,
    handler:(req,res,next)=>{
      return res.status(429).json({message:"Too Many Requests please try egain later"})
    },
    keyGenerator:(req,res,next)=>{
      const ip = ipKeyGenerator(req.ip , 56);
      console.log(`${ip}-${req.path}`);
      return `${ip}-${req.path}`;
    }
  })
  
  //convert buffer data
  app.use(cors(),helmet(), express.json());
  app.use("/uploads", express.static("../uploads"));
  //DB
  await connectDB();
  await radisConnection();

  //application routing
  app.get("/", (req, res) => res.send("Hello World!"));
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/message", messageRouter);

  //invalid routing
  app.use("{/*dummy}", (req, res) => {
    return res.status(404).json({ message: "Invalid application routing" });
  });

  //error-handling
  app.use((error, req, res, next) => {
    const status = error.cause?.status ?? 500;
    return res.status(status).json({
      error_message:
        status == 500
          ? "something went wrong"
          : error.message ?? "something went wrong",
      extra: error?.cause?.extra || undefined,
      stack: NODE_ENV == "development" ? error.stack : undefined,
    });
  });

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}
export default bootstrap;

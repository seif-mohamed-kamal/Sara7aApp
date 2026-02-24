import mongoose from "mongoose";
import { DB_URI } from "../../config/config.service.js";

export const connectDB = async () => {
  try {
    const result = await mongoose.connect(DB_URI);
    console.log("Connected Successfully");
  } catch (error) {
    console.log(`Error to connect ${error}`);
  }
};

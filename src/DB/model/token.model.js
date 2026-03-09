import mongoose from "mongoose";
const tokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    jti: { type: String, required: true },
    expireIn: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);


tokenSchema.index("expireIn", { expireAfterSeconds: 0 });
export const tokenModel =
  mongoose.models.token || mongoose.model("token", tokenSchema);

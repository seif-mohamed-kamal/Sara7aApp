import mongoose from "mongoose";
import { genderEnum, providerEnum, roleEnum } from "../../common/enums/index.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [2, "firstname cannot be less than 2 characters"],
      maxLength: [25, "firstname cannot exceed 25 characters"],
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      minLength: [2, "lastname cannot be less than 2 characters"],
      maxLength: [25, "lastname cannot exceed 25 characters"],
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: String,

    gender: {
      type: Number,
      enum: Object.values(genderEnum),
      default: genderEnum.Male,
    },

    role:{
      type:Number,
      enum:Object.values(roleEnum),
      default:roleEnum.user
    },
    provider: {
      type: Number,
      enum: Object.values(providerEnum),
      default: providerEnum.system,
    },

    profilePicture: String,
    coverProfilePicture: [String],

    confirmEmail: Date,
    changeCredentialsTime: Date,
  },
  {
    collection: "Route_users",
    timestamps: true,
    strict: true,
    strictQuery: true,
    optimisticConcurrency: true,
    autoIndex: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema
  .virtual("username")
  .set(function (value) {
    const [firstName, lastName] = value?.split(" ") || [];
    this.set({ firstName, lastName });
  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

export const usermodel =
  mongoose.models.user || mongoose.model("user", userSchema);

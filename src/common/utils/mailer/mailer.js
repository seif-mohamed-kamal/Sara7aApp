import nodemailer from "nodemailer";
import { APP_GMAIL, APP_PASSWORD } from "../../../../config/config.service.js";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: APP_GMAIL,
    pass: APP_PASSWORD,
  },
});

export const sendOTP = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: APP_GMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
    });

    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Email error:", error);
    throw new Error("Failed to send OTP email");
  }
};

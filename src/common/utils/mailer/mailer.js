import nodemailer from "nodemailer";
import { APP_GMAIL, APP_PASSWORD } from "../../../../config/config.service.js";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: APP_GMAIL,
    pass: APP_PASSWORD,
  },
});

export const sendEmail = async ({
  to,
  cc,
  bcc,
  subject,
  html,
  attachments = [],
} = {}) => {
  try {
    const info = await transporter.sendMail({
      from: `SARA7A APP ❤️`,
      to,
      cc,
      bcc,
      subject,
      html,
      attachments,
    });

    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Email error:", error);
    throw new Error("Failed to send OTP email");
  }
};

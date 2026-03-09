import { validation } from "../../../middleware/validatio.miidleware.js";

export const fileExtention = {
  image: ["image/png", "image/jpg", "image/jpeg"],
  video: ["/video/mp4"],
};

export const fileFiter = (validation = []) => {
  return function (req, file, cb) {
    if (!validation.includes(file.mimetype)) {
      return cb(
        new Error("invalid file format"),
        { cause: { status: 400 } },
        false
      );
    }
    return cb(null, true);
  };
};

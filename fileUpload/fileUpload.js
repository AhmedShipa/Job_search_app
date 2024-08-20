import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../src/utilities/appError.js";

const fileUpload = (folderName) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `uploads/${folderName}`);
    },
    filename: function (req, file, cb) {
      cb(null, uuidv4() + "-" + file.originalname);
    },
  });

  function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("application")) {
      cb(null, true);
    } else {
      cb(new AppError(`you can upload pdf only`), false);
    }
  }
  const upload = multer({ fileFilter, storage });
  return upload;
};

export const uploadSingleFile = (fieldName, folderName) => {
  return fileUpload(folderName).single(fieldName);
};
export const uploadMixOfFiles = (arrayOfFields, folderName) => {
  return fileUpload(folderName).fields(arrayOfFields);
};

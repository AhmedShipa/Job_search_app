import { User } from "../models/user.model.js";
import { AppError } from "../utilities/appError.js";

// check email and number is unique
export const checkEmail = async (req, res, next) => {
  const user = await User.findOne({
    $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }],
  });
  if (user) return next(new AppError(`email or number already exists`, 401));
  next();
};

import { User } from "../../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { email } from "../../utilities/email.js";
import { customAlphabet, nanoid } from "nanoid";
import { Company } from "../../models/company.model.js";
import { Job } from "../../models/job.model.js";
import { Application } from "../../models/application.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utilities/appError.js";
import { ApiFeatures } from "../../utilities/apiFeature.js";

// signUp new user
const signUp = catchError(async (req, res, next) => {
  // hash password
  req.body.password = bcrypt.hashSync(req.body.password, 8);

  // generating OTP
  const code = customAlphabet("123456789", 4);
  req.body.OTP = code();
  // sending OTP
  email(req.body.OTP);
  await User.insertMany(req.body);
  // setting the time of produced OTP
  const dateNow = new Date();
  const updatedUser = await User.findOneAndUpdate(
    { email: req.body.email },
    { producedAT: dateNow },
    { new: true }
  );
  //   hiding password from response
  updatedUser.password = undefined;
  res.status(201).json({ message: `user added successfully`, updatedUser });
});

// confirmEmail
const confirmEmail = catchError(async (req, res, next) => {
  let dateNow = new Date();
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError(`invalid email`, 401));

  // setting time for expire of OTP
  function dateDifference(date1, date2) {
    const newDate1 = new Date(String(date1)).getMinutes();
    const newDate2 = new Date(date2).getMinutes();

    return newDate1 - newDate2;
  }
  let difference = dateDifference(dateNow, user.producedAT);
  //   setting time of OTP 3 minutes before expire
  if (req.body.OTP != user.OTP || req.body.OTP == null || difference > 3) {
    // removing OTP if expired time
    await User.updateOne(
      { email: req.body.email },
      { OTP: null, expiredAt: dateNow }
    );
    return next(new AppError(`invalid OTP`, 401));
  }
  // verification of user and setting the expire date of OTP
  await User.updateOne(
    { email: req.body.email },
    { isVerified: true, OTP: null, expiredAt: dateNow }
  );
  res.json({ message: "email confirmed" });
});

// signIn user
const signIn = catchError(async (req, res, next) => {
  // signIn with email or mobileNumber or recoveryEmail
  const user = await User.findOne({
    $or: [
      { email: req.body.email },
      { mobileNumber: req.body.mobileNumber },
      { recoveryEmail: req.body.recoveryEmail },
    ],
  });
  // check if user confirmed email
  if (user.isVerified == false)
    return res.json({ message: `please confirm your email` });
  //   generating the token for user
  jwt.sign(
    { userName: user.userName, userId: user._id, role: user.role },
    process.env.secretKey,
    async (err, token) => {
      if (!user || !bcrypt.compareSync(req.body.password, user.password))
        return next(new AppError(`invalid email or password`, 401));
      // updating the status of user to "online"
      await User.updateOne({ email: req.body.email }, { status: "online" });
      res.status(200).json({ message: `login`, token });
    }
  );
});

// update user and update password
const updateUser = catchError(async (req, res, next) => {
  // check if the email and mobileNumber is unique in middleware
  const user = await User.findByIdAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
  });
  res.status(200).json({ message: `user updated successfully`, user });
});

// delete user
const deleteUser = catchError(async (req, res, next) => {
  // check the if the user is logged in middleware
  const user = await User.findByIdAndDelete({ _id: req.params.id });

  // confirm that when i delete a user to delete what is related to him
  let company = await Company.findOne({ companyHR: req.params.id });
  if (company) await Company.findOneAndDelete({ companyHR: req.params.id });
  let job = await Job.findOne({ addedBy: req.params.id });
  if (job) await Job.findByIdAndDelete({ addedBy: req.params.id });
  let application = await Application.findOne({ userId: req.params.id });
  if (application)
    await Application.findByIdAndDelete({ userId: req.params.id });

  res.status(200).json({ message: `user deleted successfully` });
});

// get users
const getUsers = catchError(async (req, res, next) => {
  // applying api features
  let apiFeatures = new ApiFeatures(User.find(), req.query)
    .pagination()
    .fields()
    .filter()
    .sort()
    .search();
  let user = await apiFeatures.mongooseQuery;
  res
    .status(200)
    .json({ message: "success", page: apiFeatures.pageNumber, user });
});

// Get all accounts associated to a specific recovery Email
const getByRecoveryEmail = catchError(async (req, res, next) => {
  const user = await User.find({ recoveryEmail: req.query.recoveryEmail });
  res.json({ user });
});

// Get all accounts associated to a specific recovery Email
const getAllUsers = catchError(async (req, res, next) => {
  const users = await User.find();
  res.json({ users });
});

// change password
const changePassword = catchError(async (req, res, next) => {
  let token = req.headers.token;
  let userPayload = null;
  // verifying token
  jwt.verify(token, process.env.secretKey, (err, payload) => {
    if (err) return next(new AppError(`invalid token`, 401));
    userPayload = payload;
  });
  // check the id in the token is right
  let user = await User.findById(userPayload.userId);
  // check the old password is right
  if (!user || !bcrypt.compareSync(req.body.oldPassword, user.password)) {
    return next(new AppError(`old password incorrect`, 401));
  } else {
    req.body.newPassword = bcrypt.hashSync(req.body.newPassword, 8);
    // creating the new password
    await User.findOneAndUpdate(
      { _id: userPayload.userId },
      { password: req.body.newPassword, passwordChangedAt: Date.now() }
    );
    // generating token
    let token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.secretKey
    );
    res.json({ message: "password changed successfully", newToken: token });
  }
});

// protect the routes
const protectedRoutes = catchError(async (req, res, next) => {
  let token = req.headers.token;
  let userPayload = null;
  // verifying token
  jwt.verify(token, process.env.secretKey, (err, payload) => {
    if (err) return next(new AppError(`invalid token`, 401));
    userPayload = payload;
  });
  // check the id in the token is right
  let user = await User.findById(userPayload.userId);

  if (!user) return next(new AppError(`user not found`));
  if (user.passwordChangedAt) {
    // setting the time of password change with seconds
    let time = parseInt(user.passwordChangedAt.getTime() / 1000);
    // check if the time of password change is greater than the time of generating of token
    if (time > userPayload.iat)
      return next(new AppError(`invalid token ....please login again`, 401));
  }
  req.user = userPayload;
  next();
});

// check the role
const allowedTo = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      return next(new AppError(`you are not allowed to do this action`, 401));
    }
  };
};

// forget password
const forgetPassword = catchError(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { email: req.body.email },
    { $unset: { password: 1 } },
    { new: true }
  );

  user || next(new AppError(`user not found`, 401));

  // hash password
  req.body.newPassword = bcrypt.hashSync(req.body.newPassword, 8);
  const newPassword = await User.findOneAndUpdate(
    { email: req.body.email },
    { password: req.body.newPassword },
    { new: true }
  );
  !newPassword ||
    res
      .status(201)
      .json({ message: `success adding new password`, newPassword });
});

export {
  signUp,
  signIn,
  updateUser,
  deleteUser,
  confirmEmail,
  getByRecoveryEmail,
  getAllUsers,
  protectedRoutes,
  allowedTo,
  changePassword,
  forgetPassword,
  getUsers,
};

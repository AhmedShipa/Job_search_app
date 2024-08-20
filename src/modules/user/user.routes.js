import express from "express";
import {
  allowedTo,
  changePassword,
  confirmEmail,
  deleteUser,
  forgetPassword,
  getAllUsers,
  getByRecoveryEmail,
  getUsers,
  protectedRoutes,
  signIn,
  signUp,
  updateUser,
} from "./user.controller.js";
import { checkEmail } from "../../middleware/checkEmail.js";
import { isLogged } from "../../middleware/isLogged.js";
import { validate } from "../../middleware/valiadate.js";
import { signInVal, signUpVal, updateUserVal } from "./user.validation.js";
export const userRouter = express.Router();

userRouter
  .route("/")
  .post(validate(signUpVal), checkEmail, signUp)
  .get(getUsers);
userRouter
  .route("/:id")
  .put(
    validate(updateUserVal),
    isLogged,
    checkEmail,
    protectedRoutes,
    allowedTo("user", "company_HR"),
    updateUser
  )
  .delete(
    isLogged,
    protectedRoutes,
    allowedTo("user", "company_HR"),
    deleteUser
  );
userRouter.post("/signIn", validate(signInVal), signIn);
userRouter.get("/getByRecoveryEmail", getByRecoveryEmail);
userRouter.get("/getAllUsers", getAllUsers);
userRouter.patch("/confirmEmail", confirmEmail);
userRouter.patch(
  "/changePassword",
  protectedRoutes,
  allowedTo("user", "company_HR"),
  changePassword
);
userRouter.patch(
  "/forgetPassword",
  protectedRoutes,
  allowedTo("user", "company_HR"),
  forgetPassword
);
